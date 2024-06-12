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

const AddRecommendation = ({ open, setOpen, setData, handleCloseMenu, id }) => {
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
  const [selecteFile, setSelectFile] = useState([]);
  const videoRef = useRef(null);
  const [selecteVideo, setSelectVideo] = useState([]);
  const handleOpenFile = () => {
    fileInputRef.current.click();
  };
  const handleOpenVideo = () => {
    videoRef.current.click();
  };

  const handleSelectFile = (e) => {
    setSelectFile(e.target.files);
  };

  const handleSelectVideo = (e) => {
    setSelectVideo(e.target.files);
  };
  console.log(selecteFile);
  console.log(selecteVideo);
  const formik = useFormik({
    initialValues: {
      description: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData();
      console.log(id);
      formData.append('description', values.description);
      formData.append('recommendation_category_id', id);
      [...selecteFile].map((image, i) => {
        formData.append(`images[${i}]`, image);
      });
      [...selecteVideo].map((video, i) => {
        formData.append(`videos[${i}]`, video);
      });
      axios
        .post(`${process.env.REACT_APP_API_URL}admin/recommendation/store`, formData, {
          headers: headerApi(token),
        })
        .then((res) => {
          console.log(res);
          setLoading(false);
          setSuccessMessage('Added Success');
          setData((prev) => [...prev, res.data.data]);
          handleClose();
        })
        .catch((error) => {
          console.log(error);
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
          {'Add Recommendation'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={3} sx={{ marginTop: '20px' }}>
              <Grid item xs={12}>
                <TextField
                  color="primary"
                  fullWidth
                  label="Description"
                  name="description"
                  required
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
              </Grid>
              {/* <Grid item xs={12} md={6} sx={{ position: 'relative' }}></Grid> */}
              <Grid item xs={12} sx={{ position: 'relative', display: 'flex', gap: '10px' }}>
                <label htmlFor="file">
                  <Button variant="contained" onClick={handleOpenFile} color="primary" sx={{ color: '#fff' }}>
                    Images
                  </Button>
                  <input
                    id="file"
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleSelectFile}
                  />
                </label>
                <label htmlFor="file">
                  <Button variant="contained" onClick={handleOpenVideo} color="primary" sx={{ color: '#fff' }}>
                    Videos
                  </Button>
                  <input
                    id="file"
                    type="file"
                    multiple
                    accept="video/mp4, video/mov, video/ogg"
                    style={{ display: 'none' }}
                    ref={videoRef}
                    onChange={handleSelectVideo}
                  />
                </label>
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

export default AddRecommendation;
