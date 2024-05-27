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
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';

const AddCity = ({ open, setOpen, setData }) => {
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
    setErrorMessage('');
    setSuccessMessage('');
  };


  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData()
      formData.append("name", values.name)
      axios
        .post(`${process.env.REACT_APP_API_URL}admin/cities/create`, formData, {
          headers: headerApi(token)
        })
        .then((res) => {
          setSuccessMessage('Added success');
          setErrorMessage('');
          setLoading(false);
          setOpen(false)
          setData((prev) => [...prev, res.data.city])();
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
          <DialogTitle id="alert-dialog-title">{'Add City'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ marginTop: '20px' }}>
              <Grid item>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  required
                  value={formik.values.name}
                  onChange={formik.handleChange}
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

export default AddCity;
