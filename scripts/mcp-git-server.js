#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class GitMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'git-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'git_status',
            description: 'Get the current git status of the repository',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'git_add',
            description: 'Add files to git staging area',
            inputSchema: {
              type: 'object',
              properties: {
                files: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Files to add to staging area',
                },
              },
              required: ['files'],
            },
          },
          {
            name: 'git_commit',
            description: 'Commit staged changes with a message',
            inputSchema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Commit message',
                },
              },
              required: ['message'],
            },
          },
          {
            name: 'git_push',
            description: 'Push commits to remote repository',
            inputSchema: {
              type: 'object',
              properties: {
                remote: {
                  type: 'string',
                  description: 'Remote name (default: origin)',
                  default: 'origin',
                },
                branch: {
                  type: 'string',
                  description: 'Branch name (default: current branch)',
                },
              },
            },
          },
          {
            name: 'git_pull',
            description: 'Pull changes from remote repository',
            inputSchema: {
              type: 'object',
              properties: {
                remote: {
                  type: 'string',
                  description: 'Remote name (default: origin)',
                  default: 'origin',
                },
                branch: {
                  type: 'string',
                  description: 'Branch name (default: current branch)',
                },
              },
            },
          },
          {
            name: 'git_log',
            description: 'Show git commit history',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Number of commits to show (default: 10)',
                  default: 10,
                },
              },
            },
          },
          {
            name: 'git_branch',
            description: 'List, create, or switch branches',
            inputSchema: {
              type: 'object',
              properties: {
                action: {
                  type: 'string',
                  enum: ['list', 'create', 'switch'],
                  description: 'Action to perform',
                },
                name: {
                  type: 'string',
                  description: 'Branch name (required for create/switch)',
                },
              },
              required: ['action'],
            },
          },
          {
            name: 'git_diff',
            description: 'Show differences between commits, commit and working tree, etc',
            inputSchema: {
              type: 'object',
              properties: {
                staged: {
                  type: 'boolean',
                  description: 'Show staged changes',
                  default: false,
                },
                file: {
                  type: 'string',
                  description: 'Specific file to show diff for',
                },
              },
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'git_status':
            return await this.gitStatus();
          case 'git_add':
            return await this.gitAdd(args.files);
          case 'git_commit':
            return await this.gitCommit(args.message);
          case 'git_push':
            return await this.gitPush(args.remote, args.branch);
          case 'git_pull':
            return await this.gitPull(args.remote, args.branch);
          case 'git_log':
            return await this.gitLog(args.limit);
          case 'git_branch':
            return await this.gitBranch(args.action, args.name);
          case 'git_diff':
            return await this.gitDiff(args.staged, args.file);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async gitStatus() {
    const output = execSync('git status --porcelain', { encoding: 'utf8' });
    const statusOutput = execSync('git status', { encoding: 'utf8' });
    
    return {
      content: [
        {
          type: 'text',
          text: `Git Status:\n${statusOutput}\n\nPorcelain Output:\n${output}`,
        },
      ],
    };
  }

  async gitAdd(files) {
    const fileList = files.join(' ');
    const output = execSync(`git add ${fileList}`, { encoding: 'utf8' });
    
    return {
      content: [
        {
          type: 'text',
          text: `Added files: ${fileList}\n${output}`,
        },
      ],
    };
  }

  async gitCommit(message) {
    const output = execSync(`git commit -m "${message}"`, { encoding: 'utf8' });
    
    return {
      content: [
        {
          type: 'text',
          text: `Commit successful:\n${output}`,
        },
      ],
    };
  }

  async gitPush(remote = 'origin', branch) {
    const pushCommand = branch ? `git push ${remote} ${branch}` : `git push ${remote}`;
    const output = execSync(pushCommand, { encoding: 'utf8' });
    
    return {
      content: [
        {
          type: 'text',
          text: `Push successful:\n${output}`,
        },
      ],
    };
  }

  async gitPull(remote = 'origin', branch) {
    const pullCommand = branch ? `git pull ${remote} ${branch}` : `git pull ${remote}`;
    const output = execSync(pullCommand, { encoding: 'utf8' });
    
    return {
      content: [
        {
          type: 'text',
          text: `Pull successful:\n${output}`,
        },
      ],
    };
  }

  async gitLog(limit = 10) {
    const output = execSync(`git log --oneline -${limit}`, { encoding: 'utf8' });
    
    return {
      content: [
        {
          type: 'text',
          text: `Recent commits (${limit}):\n${output}`,
        },
      ],
    };
  }

  async gitBranch(action, name) {
    let output;
    
    switch (action) {
      case 'list':
        output = execSync('git branch -a', { encoding: 'utf8' });
        break;
      case 'create':
        if (!name) throw new Error('Branch name is required for create action');
        output = execSync(`git checkout -b ${name}`, { encoding: 'utf8' });
        break;
      case 'switch':
        if (!name) throw new Error('Branch name is required for switch action');
        output = execSync(`git checkout ${name}`, { encoding: 'utf8' });
        break;
      default:
        throw new Error(`Unknown branch action: ${action}`);
    }
    
    return {
      content: [
        {
          type: 'text',
          text: `Branch ${action}:\n${output}`,
        },
      ],
    };
  }

  async gitDiff(staged = false, file) {
    let command = 'git diff';
    if (staged) command += ' --staged';
    if (file) command += ` ${file}`;
    
    const output = execSync(command, { encoding: 'utf8' });
    
    return {
      content: [
        {
          type: 'text',
          text: `Git diff${staged ? ' (staged)' : ''}${file ? ` for ${file}` : ''}:\n${output}`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Git MCP server running on stdio');
  }
}

const server = new GitMCPServer();
server.run().catch(console.error);
