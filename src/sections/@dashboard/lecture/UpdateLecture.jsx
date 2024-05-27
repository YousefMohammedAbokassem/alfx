import { LoadingButton } from '@mui/lab';
import { Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { customDecrypt } from 'src/utils/hashingFunction';
import { headerApi } from 'src/utils/headerApi';

const UpdateLecture = ({ open, setData, handleClose, element, selectedId }) => {
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      order: '',
      video: '',
      duration: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('order', values.order);
      formData.append('video', values.video);
      formData.append('duration', values.duration);
      formData.append('chapter_id', id);
      formData.append('id', selectedId);
      formData.append('file', selectedFile);
      axios
        .post(`${process.env.REACT_APP_API_URL}admin/courses/lectures/update`, formData, {
          headers: headerApi(token),
        })
        .then((res) => {
          setErrorMessage('');
          setLoading(false);
          handleClose();
          setData((prev) =>
            prev.map((admin) =>
              admin.id === element.id
                ? {
                    ...admin,
                    name: values.name,
                    description: values.description,
                    order: values.order,
                    video: values.video,
                    duration: values.duration,
                  }
                : admin
            )
          );
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          if (error.response) {
            setErrorMessage(error.response.data.error);
          } else {
            setErrorMessage('Connection failed');
          }
          setSuccessMessage('');
        });
    },
  });

  useEffect(() => {
    if (element) {
      formik.setValues({
        name: element.name || '',
        description: element.description || '',
        order: element.order || '',
        duration: element.duration || '',
        video: element.video ? customDecrypt(element.video) : '',
      });
    }
  }, [element, formik.setValues]);

  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleSelectFile = (e) => {
    setSelectedFile(e.target.files[0]);
  };

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
                  label="Description"
                  name="description"
                  required
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Order"
                  name="order"
                  required
                  value={formik.values.order}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Duration by min"
                  name="duration"
                  required
                  value={formik.values.duration}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Video"
                  name="video"
                  required
                  value={formik.values.video}
                  onChange={formik.handleChange}
                />
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

export default UpdateLecture;
