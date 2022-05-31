import * as React from 'react';
import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Title from '../../../components/Title';
import ItemsActionMenu from './ItemsActionMenu'


function preventDefault(event) {
  event.preventDefault();
}

export default function ItemsList() {
  const [rows, setRows]  = React.useState([]);

  const getCurrentBid = (currentBid) => {
    return (currentBid) ? 
      `${currentBid.user.firstName} ${currentBid.user.lastName} - $${currentBid.amount}` :
      "No current bid";
  }

  const getCurrentStatusText = (status) => {
    switch(status) {
      case 10:
        return "Draft";
      case 20:
        return "Live";
      case 30:
        return "Paused";
      default:
        return "UNKNOWN";
    }
  }

  React.useEffect(() => {
    axios.get('http://localhost:3500/raffles')
    .then((response) => {
      setRows(response.data ?? []);
    });
  }, []);

  return (
    <React.Fragment>
        <Title>Raffle Items</Title>
        <Grid item xs={12} sx={{'text-align': 'right', mb: 4}}>
            <Button variant="contained" href="/admin/items/add">Add Item</Button>
        </Grid>
        
        <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Starting Price</TableCell>
            <TableCell>Current Bid</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>




          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.title}</TableCell>
              <TableCell>{`$${row.startPrice}`}</TableCell>
              <TableCell>{getCurrentBid(row.currentBid)}</TableCell>
              <TableCell><Chip label={getCurrentStatusText(row.status)} color="primary" /></TableCell>
              <TableCell align="right"><ItemsActionMenu id={row.id} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
