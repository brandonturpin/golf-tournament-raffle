import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackBar(props) {
  const open = props.open;
  const close = props.close;
  const message = props.message;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    close();
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={props.type} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}











// import Alert from '@mui/material/Alert';


// function Error(props) {  
//     return (
//         <Alert variant="outlined" severity="error">
//             {props.message}
//         </Alert>
//     );
// }
  

// function Warning(props) {  
//     return (
//         <Alert variant="outlined" severity="warning">
//             {props.message}
//         </Alert>
//     );
// }
  

// function Info(props) {  
//     return (
//         <Alert variant="outlined" severity="info">
//             {props.message}
//         </Alert>
//     );
// }
  

// function Success(props) {  
//     return (
//         <Alert variant="outlined" severity="success">
//             {props.message}
//         </Alert>
//     );
// }

// export {
//     Error, Warning, Info, Success
// };