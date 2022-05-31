import * as React from 'react';
import axios from "axios";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { UserApp } from './UserApp';
import { useParams } from "react-router-dom";
import ProductSlider from './components/ProductSlider'
import { TextField } from '@mui/material';
import { getAccessToken } from './helpers/auth'
import SnackBar from './Admin/components/alerts'
import './Item.css';
import Cookies from 'js-cookie'

const toCurrency = (amount) => {
  if(!amount){
    return "$0.00"
  }

  amount = parseInt(amount, 10);
  return `$${amount.toFixed(2)}`;
}

const WinningBidderInfo = (props) => {
  const currentBid = props.currentBid;
  
  if(!currentBid){
    return null;
  }

  return (
    <div className='current-bid-name'> Current Winning Bider: {currentBid.fullName}</div>
  )
}

const BidHistory = (props) => {
  const bidHistory = props.bidHistory;
  console.log("Bid History");
  console.log(bidHistory);

  return (
    <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <h1 className='bid-history-title'>Bid History</h1>
          <div className='bid-history-table'>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Bidder</TableCell>
                    <TableCell align="right">Bid Time</TableCell>
                    <TableCell align="right">Bid Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bidHistory.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.fullName}
                      </TableCell>
                      <TableCell align="right">{row.bidTime}</TableCell>
                      <TableCell align="right">{toCurrency(row.bidAmount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Paper>
      </Grid>
  )
}

function ItemContent() {
  let { id } = useParams();

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
  const bidHistory = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  const buildRaffleItem = (
    id = "", 
    title = "", 
    startingPrice = "", 
    currentBid = null, 
    increment = "", 
    status = "", 
    description = "",
    images = [],
    bids = []) => {
    return { id, title, startingPrice, currentBid, increment, status, description, images, bids };
  }

  const [raffleItem, setRaffleItem] = React.useState(buildRaffleItem());
  const [modalPage, setModalPage] = React.useState(1);
  const [showBidModal, setShowBidModal] = React.useState(false);
  const [bidValues, setBidValues] = React.useState({
    bidAmount: { value: "", isValid: true, error: "" },
    fullName: { value: "", isValid: true, error: "" },
    emailAddress:  { value: "", isValid: true, error: "" },
    phoneNumber:  { value: "", isValid: true, error: "" }
  });  
  const [snackBars, setSnackbars] = React.useState({
    error: {
      active: false,
      message: "error message"
    },
    success: {
      active: false,
      message: "success message"
    }
  });

  const showSnackbar = (type, message) => {
    const snackbar = snackBars[type];
    snackbar.active = true;
    snackbar.message = message;
    setSnackbars({...snackBars, success: snackbar });
  }

  const closeSnackbar = (type) => {
    const snackbar = snackBars[type];
    snackbar.active = false;
    setSnackbars({...snackBars, success: snackbar });
  }
  
  const handleBidModalClose = () => setShowBidModal(false);
  const handleBidModalShow = () => {
    setModalPage(1);
    setShowBidModal(true);
  }

  const isNumber = (value) => {
    const lastChar = value[value.length - 1];

    if(isNaN(parseInt(lastChar))) {
      return false;
    }
    return true;
  };
  
  const handleChange = (prop) => (event) => {
    let value = event.target.value;

    if (prop === "bidAmount") {
      if(!isNumber(value)){
        setBidValues({...bidValues, "bidAmount": {...bidValues[prop], "isValid": false, "error": "Numbers only" }});
        return;
      }
    }

    if (prop === "phoneNumber") {
      let format = true;

      const lastChar = value[value.length - 1];

      if(lastChar === "(" || lastChar === "-") {
        value = value.slice(0, -1);
        format = false;
      }
      
      if(lastChar === ")" || lastChar === " ") {
        value = value.slice(0, -2);
        format = false;
      }

      if(!isNumber(value) && value !== ""){
        setBidValues({...bidValues, "phoneNumber": {...bidValues[prop], "isValid": false, "error": "Numbers only" }});
        return;
      }

      if(format){
        if(value.length === 1){
          value = `(${value}`;
        }
  
        if(value.length === 4){
          value = `${value}) `;
        }
  
        if(value.length === 9){
          value = `${value}-`;
        }
  
        if(value.length === 15){
          return;
        }
      }
    }

    setBidValues({...bidValues, [prop]: {...bidValues[prop], "value": value, "isValid": true,  "error": "" }});
  };


  const validBid = (bidAmount) => {
    if (raffleItem.currentBid) {
      return parseInt(bidAmount) > parseInt(raffleItem.currentBid.bidAmount);
    }  else {
      return parseInt(bidAmount) > parseInt(raffleItem.startingPrice);
    }    
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let bidAmount = parseInt(bidValues.bidAmount.value);

    if(!bidAmount){
      showSnackbar("error", "Must Include Bid Amount")
      return;
    }

    if(!validBid(bidAmount)){
      showSnackbar("error", "Bid must be $1 more than current bid");
      return;
    }

    if(!bidValues.fullName.value){
      showSnackbar("error", "Must Include Name")
      return;
    }

    if(!bidValues.emailAddress.value){
      showSnackbar("error", "Must Include Email Address")
      return;
    }

    if(!bidValues.phoneNumber.value){
      showSnackbar("error", "Must Include Phone Number")
      return;
    }

    axios.post(`http://localhost:3500/raffles/placeBid`,{
      raffleId: raffleItem.id,
      bidAmount: bidAmount,
      fullName: bidValues.fullName.value,
      emailAddress: bidValues.emailAddress.value,
      phoneNumber: bidValues.phoneNumber.value
    })
    .then((response) => {
      if(response.status === 200 && response.data.isSuccess){
        
        const newBid = {
          emailAddress: bidValues.emailAddress.value,
          bidAmount: bidAmount,
          fullName: bidValues.fullName.value,
          phoneNumber: bidValues.phoneNumber.value,
          bidTime: new Date().toLocaleString('en-US', {timeZone: 'America/Denver'})
        }

        let updatedBids = raffleItem.bids;
        updatedBids.push(newBid);
        updatedBids = updatedBids.sort((a,b) => (a.bidAmount < b.bidAmount) ? 1 : -1);


        setRaffleItem({...raffleItem, "bids": updatedBids, "currentBid":  newBid});
        handleBidModalClose();
        showSnackbar("success", "Bid Placed")
      }
    });
  }

  React.useEffect(() => {
    axios.get(`http://localhost:3500/raffles/${id}`)
    .then((response) => {
      if(response.status === 200 && response.data.isSuccess){
        const data = response.data.value;
        const sortedBids = data.bids?.sort((a,b) => (a.bidAmount < b.bidAmount) ? 1 : -1) ?? null;
        const currentBid = sortedBids ? sortedBids[0] : null;

        const raffle = buildRaffleItem(
          data.id,
          data.title,
          data.startPrice,
          currentBid,
          data.incramentAmount,
          data.status,
          data.description,
          data.images,
          sortedBids
        );

        console.log(raffle);
        setRaffleItem(raffle);
      }
    });
  }, []);

  return (
    <UserApp>
      {/* Chart */}
      <Grid item xs={12} md={6} lg={6}>
        <Paper
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
          }}
        >    
            <ProductSlider images={raffleItem.images} />          
        </Paper>
      </Grid>
      {/* Recent Deposits */}
      <Grid item xs={12} md={6} lg={6}>
        <Paper sx={{ p: 2, 'min-height': 240 }}>
          <h1 className='raffle-title'>{raffleItem.title}</h1>
          <div className='starting-bid-text'>
            Current Bid: {toCurrency(raffleItem.currentBid ? raffleItem.currentBid.bidAmount : raffleItem.startingPrice)} 
          </div>
          <WinningBidderInfo currentBid={raffleItem.currentBid} />
          <div className='raffle-description'>{raffleItem.description}</div>
          <div className='raffle-bid-button'>
            <Button variant="contained" onClick={handleBidModalShow}>Place Your Bid</Button>
          </div>
        </Paper>
      </Grid>
      
      <BidHistory bidHistory={raffleItem.bids} />
      
      <Modal
        open={showBidModal}
        onClose={handleBidModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <h2 className='bid-modal-title'>Place Bid</h2>  
          <Grid container className='bidAmountWrapper'>
            <TextField
                margin="normal"
                required
                fullWidth
                id="bidAmount"
                label="Bid Amount"
                name="bidAmount"
                autoComplete="bidAmount"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={bidValues.bidAmount.value}
                error = {!bidValues.bidAmount.isValid}
                helperText={bidValues.bidAmount.error}
                onChange={handleChange('bidAmount')}
                autoFocus
              />
          </Grid>

          <Grid container className='bidDetailsWrapper'>
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullName"
              label="Full Name"
              name="fullName"
              autoComplete="fullName"
              value={bidValues.fullName.value}
              error = {!bidValues.fullName.isValid}
              helperText={bidValues.fullName.error}
              onChange={handleChange('fullName')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="emailAddress"
              label="Email Address"
              name="emailAddress"
              autoComplete="emailAddress"
              value={bidValues.emailAddress.value}
              error = {!bidValues.emailAddress.isValid}
              helperText={bidValues.emailAddress.error}
              onChange={handleChange('emailAddress')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="phoneNumber"
              label="Phone Number"
              name="phoneNumber"
              autoComplete="phoneNumber"
              value={bidValues.phoneNumber.value}
              error = {!bidValues.phoneNumber.isValid}
              helperText={bidValues.phoneNumber.error}
              onChange={handleChange('phoneNumber')}
            />
          </Grid>

          <Grid container className='bidSubmitWrapper'>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Place Bid
            </Button>
          </Grid>
        </Box>
      </Modal>
      <SnackBar open={snackBars.success.active} close={() => { closeSnackbar("success") }} message={snackBars.success.message} type="success" />
      <SnackBar open={snackBars.error.active} close={() => {closeSnackbar("error")}} message={snackBars.error.message} type="error" />
    </UserApp>
  );
}

export default function Item() {
  return <ItemContent />;
}
