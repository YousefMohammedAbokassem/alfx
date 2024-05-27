import {
  CardContent,
  CardHeader,
  Card,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Grid,
  TextField,
  Divider,
  CardActions,
  CircularProgress,
  MenuItem,
  Stack,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { headerApi } from 'src/utils/headerApi';

const AddProduct = ({ open, setOpen, setProducts, selectedSub }) => {
  const {id} = useParams();
  const { token } = useSelector((state) => state.auth);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [values, setValues] = useState({
    name_ar: '',
    name_fr: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    description_fr: '',
    priceCustomer: '',
    priceVIP: '',
    priceWholesale: '',
  });

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fileInputRef = useRef(null);
  const handleAddImage = () => {
    fileInputRef.current.click();
  };

  const [selectedFile, setSelectedFile] = useState({});
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };


  const [addLoading, setAddLoading] = useState(false);

  const handleSubmit = (e) => {
    setAddLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    e.preventDefault();
    const formData = new FormData();
    formData.append('name_ar', values.name_ar);
    formData.append('name_fr', values.name_fr);
    formData.append('name_en', values.name_en);
    formData.append('description_ar', values.description_ar);
    formData.append('description_en', values.description_en);
    formData.append('description_fr', values.description_fr);
    formData.append('file', selectedFile);
    formData.append('priceCustomer', values.priceCustomer);
    formData.append('priceVIP', values.priceVIP);
    formData.append('priceWholesale', values.priceWholesale);
    data.forEach((element, index) => {
      formData.append(`sizes_colors_amounts[${index}][size]`, element.size);
      formData.append(`sizes_colors_amounts[${index}][color]`, element.color);
      formData.append(`sizes_colors_amounts[${index}][amount]`, element.ammount);
    });
    formData.append('brand_id', 1);
    formData.append('category_id', selectedSub !== "" ? selectedSub : id);
    formData.append('sell_in_negative', sellNegative);

    axios
      .post(`${process.env.REACT_APP_API_URL}dashboard/products/create`, formData, {
        headers: headerApi(token)
      })
      .then((res) => {
        setSuccessMessage('Success Added');
        setAddLoading(false);
      })
      .catch((error) => {
        setAddLoading(false);
        console.log(error);
        if(error.response.status === 422){
          setErrorMessage(error.response.data.error)
        }else{
          setErrorMessage("Connection Faield");
        }
      });
  };

  // handle add input
  const [data, setData] = useState([{ color: '', size: '', ammount: '' }]);

  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const handleColorChange = (e, i) => {
    const { name, value } = e.target;
    const onchangeVal = [...data];
    onchangeVal[i][name] = name === 'ammount' ? Number(value) : value;
    setData(onchangeVal);
  };
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}dashboard/colors`, {
        headers: headerApi(token)
      })
      .then((res) => {
        setColors(res.data.colors);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}dashboard/sizes`, {
        headers: headerApi(token)
      })
      .then((res) => {
        setSizes(res.data.sizes);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleClick = () => {
    setData([...data, { color: '', size: '', ammount: '' }]);
  };

  const handleDelete = (i) => {
    const deletData=[...data]
    deletData.splice(i,1)
    setData(deletData)
  }


  // validateor on input
  const checkFormValidity = () => {
    for (const item of data) {
      if (item.color === '' || item.size === '' || item.ammount === '') {
        return false;
      }
    }
    return true;
  };

  const [sellNegative, setSellNegative] = useState("")
  const handleClose = () => {
    setValues({
      name_ar: '',
      name_fr: '',
      name_en: '',
      description_ar: '',
      description_en: '',
      description_fr: '',
      priceCustomer: '',
      priceVIP: '',
      priceWholesale: '',
    })
    setData([{ color: '', size: '', ammount: '' }])
    setSelectedFile({})
    setErrorMessage("")
    setSuccessMessage("")
    setOpen(false)
    setAddLoading(false)

  }


  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Add Product'}</DialogTitle>
        <DialogContent>
          <form autoComplete="off" onSubmit={handleSubmit}>
            <Card>
              <CardHeader
                subheader="The information can be edited"
                title="Information"
                sx={{ marginBottom: '20px', padding: '0' }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Box sx={{ m: -1.5 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} sx={{ padding: '10px' }}>
                      <TextField
                        fullWidth
                        label="Name Arabic"
                        name="name_ar"
                        onChange={handleChange}
                        required
                        value={values.name_ar}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ padding: '10px' }}>
                      <TextField
                        fullWidth
                        label="Name Franch"
                        name="name_fr"
                        onChange={handleChange}
                        required
                        value={values.name_fr}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ padding: '10px' }}>
                      <TextField
                        fullWidth
                        label="Name English"
                        name="name_en"
                        onChange={handleChange}
                        required
                        value={values.name_en}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ padding: '10px' }}>
                      <TextField
                        fullWidth
                        label="Description Arabic"
                        required
                        name="description_ar"
                        onChange={handleChange}
                        type="text"
                        value={values.description_ar}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ padding: '10px' }}>
                      <TextField
                        fullWidth
                        label="Description Franch"
                        name="description_fr"
                        onChange={handleChange}
                        required
                        value={values.description_fr}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ padding: '10px' }}>
                      <TextField
                        fullWidth
                        label="Description English"
                        name="description_en"
                        onChange={handleChange}
                        required
                        value={values.description_en}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ padding: '10px' }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Price Customer "
                        name="priceCustomer"
                        onChange={handleChange}
                        required
                        value={values.priceCustomer}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ padding: '10px' }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Vip Price"
                        name="priceVIP"
                        onChange={handleChange}
                        required
                        value={values.priceVIP}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ padding: '10px' }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Price Wholesale"
                        name="priceWholesale"
                        onChange={handleChange}
                        required
                        value={values.priceWholesale}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ padding: '10px' }}>
                      <TextField
                        id="outlined-select-currency"
                        select
                        label="Sell In Negative"
                        name="color"
                        required
                        value={sellNegative}
                        onChange={(e) => setSellNegative(e.target.value) }
                        fullWidth
                      >
                          <MenuItem value= {1}>
                            true
                          </MenuItem>
                          <MenuItem value= {0}>
                            false
                          </MenuItem>
                      </TextField>
                    </Grid>
                    <Box sx={{ margin: 'auto', marginTop: '20px' }}>
                      {data.map((val, index) => (
                        <Stack direction="row" key={index} sx={{ justifyContent: 'space-between', marginTop: '20px' }}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              id="outlined-select-currency"
                              select
                              label="Colors"
                              name="color"
                              required
                              fullWidth
                              value={val.color}
                              onChange={(e) => handleColorChange(e, index)}
                            >
                              {colors.map((option, index) => (
                                <MenuItem key={index} value={option.id}>
                                  {option.name_ar}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              id="outlined-select-currency"
                              select
                              fullWidth
                              label="Sizes"
                              required
                              name="size"
                              value={val.size}
                              onChange={(e) => handleColorChange(e, index)}
                            >
                              {sizes.map((option, index) => (
                                <MenuItem key={index} value={option.id}>
                                  {option.name}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Ammount"
                              name="ammount"
                              onChange={(e) => handleColorChange(e, index)}
                              required
                              value={val.ammount}
                            />
                          </Grid>
                          {
                            data.length === 1 ? "" : 
                          <button onClick={()=>handleDelete(index)}>x</button>
                          }
                        </Stack>
                      ))}
                    </Box>
                  </Grid>
                  <Button
                    onClick={handleClick}
                    sx={{ margin: 'auto', marginTop: '10px' }}
                    disabled={!checkFormValidity()}
                  >
                    Add Details
                  </Button>
                </Box>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <div>
                  <label htmlFor="image">
                    <Button variant="contained" onClick={handleAddImage}>
                      Add Image
                    </Button>
                  </label>
                  <input
                    type="file"
                    id="image"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                  />
                </div>
                <Button variant="contained" type="submit">
                  {addLoading ? <CircularProgress sx={{ color: '#fff' }} /> : 'Save details'}
                </Button>
              </CardActions>
              {successMessage && (
                <Typography variant="h6" sx={{ color: 'green', padding: '10px 20px' }}>
                  {successMessage}
                </Typography>
              )}
              {errorMessage && (
                <Typography variant="h6" sx={{ color: 'red', padding: '10px 20px' }}>
                  {errorMessage}
                </Typography>
              )}
            </Card>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddProduct;
