import React from 'react';
import { Box, Grid } from '@mui/material';
import DataTable from './DataTable';
import GitIntegration from './GitIntegration';

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <DataTable />
        </Grid>
        <Grid item xs={12} lg={4}>
          <GitIntegration />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
