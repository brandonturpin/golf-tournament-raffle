import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ItemsList from './components/items/ItemsList';
import { AdminApp } from './AdminApp';

function DashboardContent() {
  return (
    <AdminApp>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>                  
          <ItemsList />
        </Paper>
      </Grid>
    </AdminApp>
  );
}

export default function Items() {
  return <DashboardContent />;
}
