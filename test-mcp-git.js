#!/usr/bin/env node

// Simple test script to verify MCP Git server functionality
const { spawn } = require('child_process');
const path = require('path');

async function testMCPGitServer() {
  console.log('Testing MCP Git Server...');
  
  try {
    // Start the MCP server
    const serverProcess = spawn('node', ['scripts/mcp-git-server.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: __dirname,
    });

    // Test git status request
    const testRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'git_status',
        arguments: {}
      }
    };

    serverProcess.stdin.write(JSON.stringify(testRequest) + '\n');

    let responseData = '';
    serverProcess.stdout.on('data', (data) => {
      responseData += data.toString();
      console.log('Server response:', responseData);
    });

    serverProcess.stderr.on('data', (data) => {
      console.error('Server error:', data.toString());
    });

    // Clean up after 5 seconds
    setTimeout(() => {
      serverProcess.kill();
      console.log('Test completed');
    }, 5000);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testMCPGitServer();
}
