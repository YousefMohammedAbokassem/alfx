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

const UpdateUser = ({ element, open, handleClose, setData }) => {
  const { token } = useSelector((state) => state.auth);

  console.log(element);

  const fileInputRef = useRef(null)

  const [selectedFile, setSelectedFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      birth_date: '',
      city_id: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('birth_date', values.birth_date);
      formData.append('city_id', values.city_id);
      formData.append('file', selectedFile);

      axios
        .post(`${process.env.REACT_APP_API_URL}admin/users/update/${element.id}`, formData, {
          headers: headerApi(token),
        })
        .then((res) => {
            console.log(res)
          setLoading(false);
          setSuccessMessage('Updated Successfuly');
          setData((prev) =>
          prev.map((admin) =>
            admin.id === element.id
              ? {
                  ...admin,
                  name: values.name,
                  email: values.email,
                  birth_date: values.birth_date,
                  city_id: values.city_id,
                }
              : admin
          )
        );
          handleClose()

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
        email: element.email || '',
        birth_date: element.birth_date || '',
        city_id: element.city_id || '',
      });
    }
  }, [element, formik.setValues]);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [successMessage, setSuccessMessage] = useState('');

  const [city, setCity] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/cities`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setCity(res.data.cities);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

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
                  label="Email"
                  name="email"
                  required
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Birth Date"
                  name="birth_date"
                  required
                  value={formik.values.birth_date}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city_id"
                  select
                  required
                  value={formik.values.city_id}
                  onChange={formik.handleChange}
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
                    Image
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

export default UpdateUser;
