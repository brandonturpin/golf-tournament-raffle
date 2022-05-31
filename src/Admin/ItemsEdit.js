import * as React from 'react';
import axios from "axios";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import MenuItem from '@mui/material/MenuItem';
import Title from '../components/Title';
import SnackBar from './components/alerts'
import { AdminApp } from './AdminApp';
import { useParams } from "react-router-dom";
import { AmazonS3 } from '../Admin/helpers/AmazonS3'

function EditItemContent() {

  let { id } = useParams();
  const S3 = new AmazonS3();

  const buildForm = (id = "", title = "", startingPrice = "", increment = "", status = "", description = "", images = []) => {
    return { id, title, startingPrice, increment, status, description, images };
  }

  const [values, setValues] = React.useState(buildForm());
  const [pendingChanges, setPendingChanges] = React.useState(false);
  const [imageToAdd, setImageToAdd] = React.useState();
  const [pendingImages, setPendingImages] = React.useState([]);
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

  const getImageData = (image) => {
    return new Promise((resolve) => {
      let reader = new FileReader();

      reader.onload = (e) => {
        resolve(e.target.result);
      };

      reader.readAsDataURL(image);
    });
  }

  function isFileImage(file) {
    return file && file['type'].split('/')[0] === 'image';
  }

  const handleChange = (prop) => (event) => {
    if (prop === "images") {
      const image = event.currentTarget.files[0];

      if(!isFileImage(image)){
        showSnackbar("error", "File added is not an image");
        return;
      }

      getImageData(image)
      .then(data => {
        image.data = data;
        setPendingImages([...pendingImages, image]);
        setImageToAdd("");
      });
    } else {
      setValues({ ...values, [prop]: event.target.value });
    }

    setPendingChanges(true);
  };
  
  const deletePendingImage = (image) => {
    let images = pendingImages;
    images = images.filter(x=> {
      return x.name !== image.name;
    });
    setPendingImages(images);
    setPendingChanges(true);
  }

  const deleteImage = (url) => {
    // TODO: Delete from S3
    let images = values.images;
    images = images.filter(x=> x !== url);
    setValues({...values, "images": images });
    setPendingChanges(true);
  }

  const addImagesToS3 = async(imagesToUpload) => {

    let urls = [];
    
    for(const image of imagesToUpload){
      const url = await S3.uploadFile(image);
      urls.push(url);
    }

    return urls;
  }


  const handleItemUpdate = async() => {
    let images = values.images;

    if(pendingImages.length > 0) {
      const newImages = await addImagesToS3(pendingImages);
      images = [...images, ...newImages];
    }

    values.images = images;
    setValues(values);
    setPendingImages([]);
    
    axios.post(`http://localhost:3500/raffles/update`, values)
    .then((response) => {
      if(response.status === 200 && response.data.isSuccess) {
        showSnackbar("success", "Successfully Updated")
        setPendingChanges(false);
      } else {
        showSnackbar("error", response.data.value);
      }
    })
    .catch(error => showSnackbar("error", error));
  }

  React.useEffect(() => {
    axios.get(`http://localhost:3500/raffles/${id}`)
    .then((response) => {
      if(response.status === 200 && response.data.isSuccess){
        const data = response.data.value;

        setValues(buildForm(
          data.id,
          data.title,
          data.startPrice,
          data.incramentAmount,
          data.status,
          data.description,
          data.images
        ));
      }
    });
  }, []);

  return (
    <AdminApp>           
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>                  
          <Title>Update Raffle Item</Title>
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

            <Grid item xs={12}>
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">  
                <TextField
                  id="item-description"
                  label="Description"
                  multiline
                  rows={4}
                  variant="standard"
                  value={values.description}
                  onChange={handleChange('description')}
                />
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


            {values.images.map(image => (
                <Card sx={{ maxWidth: 150, m: 2 }}>
                  <CardMedia
                    component="img"
                    height="auto"
                    image={image}
                    alt="green iguana"
                  />
                  <CardActions>
                    <Button size="small" onClick={()=>{ deleteImage(image) }}>delete</Button>
                  </CardActions>
                </Card>
              ))}


            {pendingImages.map(image => (
                <Card sx={{ maxWidth: 150, m: 2 }}>
                  <CardMedia
                    component="img"
                    height="auto"
                    image={image.data}
                    alt="green iguana"
                  />
                  <CardActions>
                    <Button size="small" onClick={()=>{ deletePendingImage(image) }}>delete</Button>
                  </CardActions>
                </Card>
              ))}
            
          <Grid item xs={12} sx={{'text-align': 'right', mb: 4}}>
              <Button disabled={!pendingChanges} variant="contained" onClick={handleItemUpdate}>Update Item</Button>
          </Grid>

          </Grid>
        </Paper>
      </Grid>
      <SnackBar open={snackBars.success.active} close={() => { closeSnackbar("success") }} message={snackBars.success.message} type="success" />
      <SnackBar open={snackBars.error.active} close={() => {closeSnackbar("error")}} message={snackBars.error.message} type="error" />
    </AdminApp>
  );
}

export default function EditItem() {
  return <EditItemContent />;
}
