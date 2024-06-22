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
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from 'src/store/authSlice';
import { headerApi } from 'src/utils/headerApi';

const rule = ['admin', 'super'];

const AddStudent = ({ open, setOpen, setData, handleCloseMenu, setOpenNotification }) => {
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
      title: '',
      body: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('body', values.body);

      axios
        .post(`${process.env.REACT_APP_API_URL}admin/notifications/send_to_all_users`, formData, {
          headers: headerApi(token),
        })
        .then((res) => {
          console.log(res);
          setLoading(false);
          // setSuccessMessage('Added Success');
          // setData((prev) => [...prev, res.data.data]);
          handleClose();
          setOpenNotification(true);
        })
        .catch((error) => {
          if (error.response) {
            setErrorMessage(error.response.data.error);
          } else {
            setErrorMessage('Error, please try again');
          }
          if (error.response.status === 401) {
            dispatch(logoutUser());
          }
          setLoading(false);
        });
    },
  });
  const dispatch = useDispatch();
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" color={'primary.main'}>
          {'Send Notifications'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ marginTop: '20px' }}>
              <Grid item xs={12}>
                <TextField
                  color="primary"
                  fullWidth
                  label="Title"
                  name="title"
                  required
                  value={formik.values.title}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  color="primary"
                  fullWidth
                  label="Body"
                  name="body"
                  required
                  value={formik.values.body}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color={'primary'}>
              Disagree
            </Button>
            <LoadingButton type="submit" loading={loading} autoFocus color={'primary'}>
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

export default AddStudent;
