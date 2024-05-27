import { LoadingButton } from '@mui/lab';
import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';

const AddPos = ({ open, handleClose, setData }) => {
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [city, setCity] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/cities`, {
        headers: headerApi(token)
      })
      .then((res) => {
        setCity(res.data.cities);
      })
      .catch((error) => { 
        console.log(error);
      });
  }, []);

  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef()
  const handleSelectFile = (e) => {
    setSelectedFile(e.target.files[0])
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      address: '',
      phone: '',
      lat: '',
      lng: '',
      city_id: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('address', values.address);
      formData.append('phone', values.phone);
      formData.append('city_id', values.city_id);
      formData.append('lat', values.lat);
      formData.append('lng', values.lng);
      formData.append('file', selectedFile);
      axios
        .post(`${process.env.REACT_APP_API_URL}admin/pos/create`, formData, {
          headers: headerApi(token)
        })
        .then((res) => {
          // setSuccessMessage('Added success');
          setErrorMessage('');
          setLoading(false);
          handleClose()
          formik.resetForm()

          setData((prev) => [...prev, res.data.pos])();
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          setErrorMessage(error.response.data.error);
          setSuccessMessage('');
        });
    },
  });

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle id="alert-dialog-title">{'Add Pos'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ marginTop: '20px' }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  required
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  required
                  value={formik.values.address}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  required
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="outlined-select-currency"
                  select
                  label="Select City"
                  name="city_id"
                  required
                  value={formik.values.city_id}
                  onChange={formik.handleChange}
                  fullWidth
                >
                  {city.map((element, index) => (
                    <MenuItem key={index} value={element.id}>
                      {element.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Lat"
                  name="lat"
                  required
                  value={formik.values.lat}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Lng"
                  name="lng"
                  required
                  value={formik.values.lng}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
                <label htmlFor="file">
                  <Button variant="contained" onClick={() => fileInputRef.current.click()}>
                    Image
                  </Button>
                </label>
                <input
                  id="file"
                  type="file"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleSelectFile}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <LoadingButton type="submit" loading={loading} autoFocus>
              Agree
            </LoadingButton>
          </DialogActions>
        </form>
        {errorMessage && (
          <Typography variant="h6" sx={{ color: 'red', textAlign: 'center', padding: '10px 20px' }}>
            {errorMessage}
          </Typography>
        )}
        {successMessage && (
          <Typography variant="h6" sx={{ color: 'green', textAlign: 'center', padding: '10px 20px' }}>
            {successMessage}
          </Typography>
        )}
      </Dialog>
    </>
  );
};

export default AddPos;
