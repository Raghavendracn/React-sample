import { spawn, ChildProcess } from 'child_process';

interface MCPResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
}

class MCPGitClient {
  private serverProcess: ChildProcess | null = null;
  private isConnected = false;

  async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      // Start the MCP Git server
      this.serverProcess = spawn('node', ['scripts/mcp-git-server.js'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: process.cwd(),
      });

      this.isConnected = true;
      console.log('MCP Git server connected');
    } catch (error) {
      console.error('Failed to connect to MCP Git server:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.serverProcess) {
      this.serverProcess.kill();
      this.serverProcess = null;
    }
    this.isConnected = false;
  }

  private async sendRequest(method: string, params: any): Promise<MCPResponse> {
    if (!this.isConnected) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      if (!this.serverProcess) {
        reject(new Error('Server process not available'));
        return;
      }

      const request = {
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params,
      };

      let responseData = '';

      const onData = (data: Buffer) => {
        responseData += data.toString();
        try {
          const response = JSON.parse(responseData);
          this.serverProcess?.stdout?.off('data', onData);
          
          if (response.error) {
            reject(new Error(response.error.message));
          } else {
            resolve(response.result);
          }
        } catch (e) {
          // Continue collecting data
        }
      };

      this.serverProcess.stdout?.on('data', onData);

      this.serverProcess.stdin?.write(JSON.stringify(request) + '\n');

      // Timeout after 10 seconds
      setTimeout(() => {
        this.serverProcess?.stdout?.off('data', onData);
        reject(new Error('Request timeout'));
      }, 10000);
    });
  }

  async getStatus(): Promise<any> {
    try {
      const response = await this.sendRequest('tools/call', {
        name: 'git_status',
        arguments: {},
      });
      return this.parseGitStatus(response.content[0].text);
    } catch (error) {
      console.error('Error getting git status:', error);
      throw error;
    }
  }

  async addFiles(files: string[]): Promise<void> {
    try {
      await this.sendRequest('tools/call', {
        name: 'git_add',
        arguments: { files },
      });
    } catch (error) {
      console.error('Error adding files:', error);
      throw error;
    }
  }

  async commit(message: string): Promise<void> {
    try {
      await this.sendRequest('tools/call', {
        name: 'git_commit',
        arguments: { message },
      });
    } catch (error) {
      console.error('Error committing:', error);
      throw error;
    }
  }

  async push(remote = 'origin', branch?: string): Promise<void> {
    try {
      await this.sendRequest('tools/call', {
        name: 'git_push',
        arguments: { remote, branch },
      });
    } catch (error) {
      console.error('Error pushing:', error);
      throw error;
    }
  }

  async pull(remote = 'origin', branch?: string): Promise<void> {
    try {
      await this.sendRequest('tools/call', {
        name: 'git_pull',
        arguments: { remote, branch },
      });
    } catch (error) {
      console.error('Error pulling:', error);
      throw error;
    }
  }

  async getLog(limit = 10): Promise<any[]> {
    try {
      const response = await this.sendRequest('tools/call', {
        name: 'git_log',
        arguments: { limit },
      });
      return this.parseGitLog(response.content[0].text);
    } catch (error) {
      console.error('Error getting git log:', error);
      throw error;
    }
  }

  async getBranches(): Promise<string[]> {
    try {
      const response = await this.sendRequest('tools/call', {
        name: 'git_branch',
        arguments: { action: 'list' },
      });
      return this.parseGitBranches(response.content[0].text);
    } catch (error) {
      console.error('Error getting branches:', error);
      throw error;
    }
  }

  async getDiff(staged = false, file?: string): Promise<string> {
    try {
      const response = await this.sendRequest('tools/call', {
        name: 'git_diff',
        arguments: { staged, file },
      });
      return response.content[0].text;
    } catch (error) {
      console.error('Error getting diff:', error);
      throw error;
    }
  }

  private parseGitStatus(statusText: string): any {
    // Parse git status output and return structured data
    const lines = statusText.split('\n');
    const staged: string[] = [];
    const unstaged: string[] = [];
    const untracked: string[] = [];
    let branch = 'master';

    for (const line of lines) {
      if (line.includes('On branch')) {
        branch = line.split('On branch ')[1];
      } else if (line.startsWith('M ')) {
        staged.push(line.substring(2).trim());
      } else if (line.startsWith(' M')) {
        unstaged.push(line.substring(2).trim());
      } else if (line.startsWith('??')) {
        untracked.push(line.substring(2).trim());
      }
    }

    return {
      staged,
      unstaged,
      untracked,
      branch,
      ahead: 0,
      behind: 0,
    };
  }

  private parseGitLog(logText: string): any[] {
    const lines = logText.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const parts = line.split(' ');
      const hash = parts[0];
      const message = parts.slice(1).join(' ');
      
      return {
        hash,
        message,
        author: 'Developer',
        date: new Date().toISOString().split('T')[0],
      };
    });
  }

  private parseGitBranches(branchText: string): string[] {
    return branchText
      .split('\n')
      .map(line => line.replace(/^\*?\s*/, '').trim())
      .filter(line => line && !line.startsWith('remotes/'));
  }
}

export const mcpGitClient = new MCPGitClient();
export default mcpGitClient;
