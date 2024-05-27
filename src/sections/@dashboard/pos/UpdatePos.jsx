import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';

const UpdatePos = ({ element, open, handleClose, onUpdateSuccess }) => {
  const { token } = useSelector((state) => state.auth);

    console.log(element)

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      address: '',
      lat: '',
      lng: '',
      city_id: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('phone', values.phone);
      formData.append('address', values.address);
      formData.append('lat', values.lat);
      formData.append('lng', values.lng);
      formData.append('city_id', values.city_id);
      formData.append('id', element.id);
      formData.append('file', selectedFile);

      axios
        .post(`${process.env.REACT_APP_API_URL}admin/pos/update`, formData, {
          headers: headerApi(token)
        })
        .then((res) => {
          setLoading(false);
          // setSuccessMessage('Updated Successfuly');
          handleClose()
          onUpdateSuccess(res.data.pos);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          setErrorMessage('Error please try again');
        });
    },
  });

  useEffect(() => {
    if (element) {
      formik.setValues({
        name: element.name || '',
        phone: element.phone || '',
        address: element.address || '',
        lat: element.lat || '',
        lng: element.lng || '',
        city_id: element.city_id || '',
      });
    }
  }, [element, formik.setValues]);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [successMessage, setSuccessMessage] = useState('');

  const [teachers, setTeachers] = useState([]);

  //handle city

  const [city, setCity] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/cities`, {
        headers: headerApi(token),
      })
      .then((res) => {
        console.log(res);
        setCity(res.data.cities);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //hnadle file
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null);



  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/teachers`, {
        headers: headerApi(token)
      })
      .then((res) => {
        setTeachers(res.data.teachers);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle id="alert-dialog-title">{'Update Course'}</DialogTitle>
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
                  label="Phone"
                  name="phone"
                  required
                  value={formik.values.phone}
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
                  label="Lat"
                  name="lat"
                  type="number"
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
              <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
                <label htmlFor="file">
                  <Button variant="contained" onClick={() => fileInputRef.current.click()}>
                    File
                  </Button>
                </label>
                <input
                  id="file"
                  type="file"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={(e) => setSelectedFile(e.target.files[0])}
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

export default UpdatePos;
