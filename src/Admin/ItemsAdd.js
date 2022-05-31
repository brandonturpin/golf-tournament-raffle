import * as React from 'react';
import axios from "axios";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import { useNavigate } from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import Title from '../components/Title';
import SnackBar from './components/alerts'
import { AdminApp } from './AdminApp';
import { AmazonS3 } from '../Admin/helpers/AmazonS3'

function AddItemContent() {

  const buildDefaultForm = () => {
    return {
      title: '',
      startingPrice: 0,
      increment: 0,
      status: '',
      images: []
    }
  }

  const navigate = useNavigate();

  const [values, setValues] = React.useState(buildDefaultForm());
  const [imageToAdd, setImageToAdd] = React.useState();
  const [previewImages, setPreviewImages] = React.useState([]);
  const [imageProgress , setImageProgress] = React.useState(0);

  const [successSnackbar, setSuccessSnackbar] = React.useState(false);
  const [errorSnackbar, setErrorSnackbar] = React.useState(false);

  const [successSnackbarMessage, setSuccessSnackbarMessage] = React.useState("");
  const [errorSnackbarMessage, setErrorSnackbarMessage] = React.useState("");

  const handleSuccessSnackbarClose = () => setSuccessSnackbar(false);
  const handlErrorSnackbarClose = () => setErrorSnackbar(false);

  const S3 = new AmazonS3();

  function isFileImage(file) {
        return file && file['type'].split('/')[0] === 'image';
    }

  const handleChange = (prop) => (event) => {
    if (prop === "images") {
      const image = event.currentTarget.files[0];

      if(!isFileImage(image)){
        setErrorSnackbarMessage("File added is not an image");
        setErrorSnackbar(true);
        return;
      }

      setValues({ ...values, "images": [...values.images, image] });
      addImageToPreview(image)
      setImageToAdd("");
    } else {
      setValues({ ...values, [prop]: event.target.value });
    }
  };

  const handleAddItem = () => {
    axios.post('http://localhost:3500/raffles',
    { 
      title: values.title,
      startPrice: values.startingPrice,
      status: values.status,
      incramentAmount: values.increment
    })
    .then((response) => {
      if(response.status === 200 && response.data.isSuccess){
        addImagesToProduct(response.data.value)
        .then(() => {
          navigate("/admin/items");
        });
      } else {
        setErrorSnackbarMessage(response.data.error);
        setErrorSnackbar(true);
      }
    })
    .catch((error) => {
      console.log(error);
      setErrorSnackbarMessage(error.message);
      setErrorSnackbar(true);
    });
  }

  const updateProduct = (request) => {
    return new Promise((resolve, reject) => {
        axios.post('http://localhost:3500/raffles/add-image-to-raffle',
        request
      )
      .then((response) => {
        if(response.status === 200 && response.data.isSuccess){
          resolve();
        } else {
          reject(response.data.error);
        }
      })
      .catch((error) => {
        reject(error);
      });
    });
  }

  const addImagesToS3 = (imagesToUpload) => {
    return new Promise((resolve, reject) => {
      let urls = [];
      for(let i = 0; i < imagesToUpload.length; i++){
        S3.uploadFile(imagesToUpload[i])
        .then(url => {
          urls.push(url);

          if (i === imagesToUpload.length - 1){
            resolve(urls);
          };
        })
      }
    });
  }

  const addImagesToProduct = (product) => {
    return new Promise((resolve, reject) => {
      addImagesToS3(values.images)
      .then(urls => updateProduct({ id: product.id, images: urls }))
      .then(() => resolve());      
    });
  }

  const addImageToPreview = (image) => {
    const run = new Promise((resolve) => {
      let reader = new FileReader();

      reader.onload = (e) => {
        resolve(e.target.result);
      };

      reader.readAsDataURL(image);
    });
    
    run.then(fileData => 
    { 
      setPreviewImages([...previewImages, { name: image.name, data: fileData }]);
    });
  }

  return (
    <AdminApp>           
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>                  
          <Title>Add Raffle Item</Title>
          <Grid container spacing={2}>  
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">  
                <InputLabel htmlFor="item-title">Title</InputLabel>
                <Input
                  id="item-title"
                  value={values.title}
                  onChange={handleChange('title')}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">  
                <InputLabel htmlFor="starting-price-amount">Starting Price</InputLabel>
                <Input
                  id="starting-price-amount"
                  value={values.startingPrice}
                  onChange={handleChange('startingPrice')}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">  
                <InputLabel htmlFor="item-increment-amount">Increment Amount</InputLabel>
                <Input
                  id="item-increment"
                  value={values.increment}
                  onChange={handleChange('increment')}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">  
                <InputLabel htmlFor="item-status">Status</InputLabel>
                <Select
                  id="item-status"
                  value={values.status}
                  label="Status"
                  onChange={handleChange('status')}
                >
                  <MenuItem value={10}>Draft</MenuItem>
                  <MenuItem value={20}>Live</MenuItem>
                  <MenuItem value={30}>Paused</MenuItem>
                </Select>
              </FormControl>
            </Grid>
             
            <Grid item xs={6}>
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">  
                <InputLabel htmlFor="item-file">Images</InputLabel>
                <Input
                  id="item-images"
                  value={imageToAdd}
                  onChange={handleChange('images')}
                  type="file"
                />
              </FormControl>
            </Grid>


             
            <Grid item xs={12} sx={{mt: 4}}>
              <Title>Uploaded Images</Title>
            </Grid>


            {previewImages.map(image => {
              return (
                <Card sx={{ maxWidth: 150, m: 2 }}>
                  <CardMedia
                    component="img"
                    height="auto"
                    image={image.data}
                    alt="green iguana"
                  />
                  <CardActions>
                    <Button size="small">delete</Button>
                  </CardActions>
                </Card>
              );
            })}
            


          <Grid item xs={12} sx={{'text-align': 'right', mb: 4}}>
              <Button variant="contained" onClick={handleAddItem}>Add Item</Button>
          </Grid>

          </Grid>
        </Paper>
      </Grid>
      <SnackBar open={successSnackbar} close={handleSuccessSnackbarClose} message={successSnackbarMessage} type="success" />
      <SnackBar open={errorSnackbar} close={handlErrorSnackbarClose} message={errorSnackbarMessage} type="error" />
    </AdminApp>
  );
}

export default function AddItem() {
  return <AddItemContent />;
}
