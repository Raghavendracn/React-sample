import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  Commit as CommitIcon,
  CloudUpload as PushIcon,
  CloudDownload as PullIcon,
  History as HistoryIcon,
  AccountTree as BranchIcon,
} from '@mui/icons-material';

interface GitStatus {
  staged: string[];
  unstaged: string[];
  untracked: string[];
  branch: string;
  ahead: number;
  behind: number;
}

interface GitCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
}

const GitIntegration: React.FC = () => {
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null);
  const [commits, setCommits] = useState<GitCommit[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commitMessage, setCommitMessage] = useState('');
  const [commitDialogOpen, setCommitDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  // Mock MCP client functions (in a real implementation, these would connect to the MCP server)
  const mcpGitClient = {
    async getStatus(): Promise<GitStatus> {
      // Simulate API call to MCP server
      const response = await fetch('/api/mcp/git/status');
      return response.json();
    },

    async addFiles(files: string[]): Promise<void> {
      const response = await fetch('/api/mcp/git/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files }),
      });
      if (!response.ok) throw new Error('Failed to add files');
    },

    async commit(message: string): Promise<void> {
      const response = await fetch('/api/mcp/git/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error('Failed to commit');
    },

    async push(): Promise<void> {
      const response = await fetch('/api/mcp/git/push', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to push');
    },

    async pull(): Promise<void> {
      const response = await fetch('/api/mcp/git/pull', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to pull');
    },

    async getLog(limit: number = 10): Promise<GitCommit[]> {
      const response = await fetch(`/api/mcp/git/log?limit=${limit}`);
      return response.json();
    },

    async getBranches(): Promise<string[]> {
      const response = await fetch('/api/mcp/git/branches');
      return response.json();
    },
  };

  const refreshGitStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      // For demo purposes, using mock data
      const mockStatus: GitStatus = {
        staged: ['src/App.tsx'],
        unstaged: ['src/components/DataTable.tsx', 'src/components/Navbar.tsx'],
        untracked: ['src/components/Sidebar.tsx'],
        branch: 'master',
        ahead: 0,
        behind: 0,
      };
      setGitStatus(mockStatus);

      const mockCommits: GitCommit[] = [
        {
          hash: 'abc123',
          message: 'Updated dashboard components',
          author: 'Developer',
          date: '2025-08-22',
        },
        {
          hash: 'def456',
          message: 'Initial dashboard setup',
          author: 'Developer',
          date: '2025-08-21',
        },
      ];
      setCommits(mockCommits);

      setBranches(['master', 'feature/dashboard', 'develop']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFiles = async (files: string[]) => {
    setLoading(true);
    try {
      await mcpGitClient.addFiles(files);
      await refreshGitStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add files');
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = async () => {
    if (!commitMessage.trim()) return;
    
    setLoading(true);
    try {
      await mcpGitClient.commit(commitMessage);
      setCommitMessage('');
      setCommitDialogOpen(false);
      await refreshGitStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to commit');
    } finally {
      setLoading(false);
    }
  };

  const handlePush = async () => {
    setLoading(true);
    try {
      await mcpGitClient.push();
      await refreshGitStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to push');
    } finally {
      setLoading(false);
    }
  };

  const handlePull = async () => {
    setLoading(true);
    try {
      await mcpGitClient.pull();
      await refreshGitStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pull');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshGitStatus();
  }, []);

  const renderStatusTab = () => (
    <Box>
      {gitStatus && (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Current Branch: <Chip label={gitStatus.branch} color="primary" size="small" />
            </Typography>
          </Box>

          {gitStatus.staged.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="success.main" sx={{ mb: 1 }}>
                Staged Changes ({gitStatus.staged.length})
              </Typography>
              <List dense>
                {gitStatus.staged.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={file} />
                    <Chip label="Staged" color="success" size="small" />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {gitStatus.unstaged.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="warning.main" sx={{ mb: 1 }}>
                Unstaged Changes ({gitStatus.unstaged.length})
              </Typography>
              <List dense>
                {gitStatus.unstaged.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={file} />
                    <Button
                      size="small"
                      onClick={() => handleAddFiles([file])}
                      startIcon={<AddIcon />}
                    >
                      Stage
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {gitStatus.untracked.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="info.main" sx={{ mb: 1 }}>
                Untracked Files ({gitStatus.untracked.length})
              </Typography>
              <List dense>
                {gitStatus.untracked.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={file} />
                    <Button
                      size="small"
                      onClick={() => handleAddFiles([file])}
                      startIcon={<AddIcon />}
                    >
                      Add
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </>
      )}
    </Box>
  );

  const renderHistoryTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Recent Commits
      </Typography>
      <List>
        {commits.map((commit, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={commit.message}
              secondary={`${commit.hash.substring(0, 7)} • ${commit.author} • ${commit.date}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const renderBranchesTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Branches
      </Typography>
      <List>
        {branches.map((branch, index) => (
          <ListItem key={index}>
            <ListItemText primary={branch} />
            <Chip
              label={branch === gitStatus?.branch ? 'Current' : 'Switch'}
              color={branch === gitStatus?.branch ? 'primary' : 'default'}
              size="small"
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Git Integration
        </Typography>
        <Button
          onClick={refreshGitStatus}
          startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<CommitIcon />}
          onClick={() => setCommitDialogOpen(true)}
          disabled={!gitStatus?.staged.length || loading}
          sx={{ mr: 1 }}
        >
          Commit
        </Button>
        <Button
          variant="outlined"
          startIcon={<PushIcon />}
          onClick={handlePush}
          disabled={loading}
          sx={{ mr: 1 }}
        >
          Push
        </Button>
        <Button
          variant="outlined"
          startIcon={<PullIcon />}
          onClick={handlePull}
          disabled={loading}
        >
          Pull
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)} sx={{ mb: 2 }}>
        <Tab label="Status" />
        <Tab label="History" />
        <Tab label="Branches" />
      </Tabs>

      {selectedTab === 0 && renderStatusTab()}
      {selectedTab === 1 && renderHistoryTab()}
      {selectedTab === 2 && renderBranchesTab()}

      <Dialog open={commitDialogOpen} onClose={() => setCommitDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Commit Changes</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Commit Message"
            fullWidth
            multiline
            rows={3}
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Enter your commit message..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommitDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCommit} variant="contained" disabled={!commitMessage.trim() || loading}>
            {loading ? <CircularProgress size={20} /> : 'Commit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default GitIntegration;
