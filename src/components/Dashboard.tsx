import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Welcome Card */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Welcome to React MUI TypeScript
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                This is a sample dashboard built with Material-UI components and TypeScript.
                You can customize this layout and add your own components.
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />}>
                Get Started
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<DashboardIcon />}
                  fullWidth
                >
                  View Dashboard
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AnalyticsIcon />}
                  fullWidth
                >
                  Analytics
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SettingsIcon />}
                  fullWidth
                >
                  Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              42
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Users
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="secondary">
              128
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Sessions
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              95%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Uptime
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">
              3.2s
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg Response
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
