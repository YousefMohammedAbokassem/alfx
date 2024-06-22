import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Grid,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';

const rule = ['admin', 'super'];

const AddTeacher = ({ open, setOpen, setData, handleCloseMenu }) => {
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleClose = () => {
    setOpen(false);
    handleCloseMenu();
    formik.resetForm();
    setErrorMessage('');
    setSuccessMessage('');
  };

  // handle file
  const fileInputRef = useRef(null);
  const [selecteFile, setSelectFile] = useState(null);

  const handleOpenFile = () => {
    fileInputRef.current.click();
  };

  const handleSelectFile = (e) => {
    setSelectFile(e.target.files[0]);
  };

  const formik = useFormik({
    initialValues: {
      phone: '',
      name: '',
      city_id: '',
      telegram: '',
      youtube: '',
      specialization: '',
      description: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('phone', values.phone);
      formData.append('name', values.name);
      formData.append('city_id', values.city_id);
      formData.append('telegram_link', values.telegram);
      formData.append('youtube_link', values.youtube);
      formData.append('specialization', values.specialization);
      formData.append('description', values.description);
      formData.append('file', selecteFile);

      for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }

      axios
        .post(`${process.env.REACT_APP_API_URL}admin/teachers/create`, formData, {
          headers: headerApi(token),
        })
        .then((res) => {
          setLoading(false);
          console.log(res);
          setSuccessMessage('Added Success');
          setData((prev) => [...prev, res.data.teacher]);
          handleClose();
        })
        .catch((error) => {
          console.log(error);
          if (error.response) {
            setErrorMessage(error.response.data.error);
          } else {
            setErrorMessage('Error, please try again');
          }
          setLoading(false);
        });
    },
  });

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

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle id="alert-dialog-title">{'Add Teacher'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ marginTop: '20px' }}>
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
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Specialization"
                  name="specialization"
                  required
                  value={formik.values.specialization}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  name="description"
                  required
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Youtube Channel Link"
                  name="youtube"
                  required
                  value={formik.values.youtube}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Telegram Channel Link"
                  name="telegram"
                  required
                  value={formik.values.telegram}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
                <label htmlFor="file">
                  <Button variant="contained" onClick={handleOpenFile}>
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

export default AddTeacher;
