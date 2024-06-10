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
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from 'src/store/authSlice';
import { headerApi } from 'src/utils/headerApi';

const UpdateAboutUs = ({ open, setOpen, aboutUs, setAboutUs, handleCloseMenu }) => {
  const { token } = useSelector((state) => state.auth);

  const handleClose = () => {
    setOpen(false);
    setErrorMessage('');
    setValues({
      name: '',
      description: '',
      count: '',
      attribute1: '',
      attribute2: '',
      attribute3: '',
      attribute4: '',
    });
  };

  const [values, setValues] = useState({
    name: '',
    description: '',
    count: '',
    attribute1: '',
    attribute2: '',
    attribute3: '',
    attribute4: '',
  });

  useEffect(() => {
    if (aboutUs) {
      setValues({
        name: aboutUs.name || '',
        description: aboutUs.description || '',
        count: aboutUs.count || '',
        attribute1: aboutUs.attribute1 || '',
        attribute2: aboutUs.attribute2 || '',
        attribute3: aboutUs.attribute3 || '',
        attribute4: aboutUs.attribute4 || '',
      });
    }
  }, [aboutUs]);

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fileInputRef = useRef(null);

  const [selecteFile, setSelectFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleOpenFile = () => {
    fileInputRef.current.click();
  };

  const handleSelectFile = (e) => {
    setSelectFile(e.target.files);
    const selectedImage = e.target.files[0];
    const reader = new FileReader();

    if (selectedImage) {
      reader.onload = function (e) {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendApi = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('description', values.description);
    formData.append('name', values.name);
    formData.append('count', values.count);
    formData.append('attribute1', values.attribute1);
    formData.append('attribute2', values.attribute2);
    formData.append('attribute3', values.attribute3);
    formData.append('attribute4', values.attribute4);

    axios
      .post(`${process.env.REACT_APP_API_URL}admin/about_us/updateProfile`, formData, {
        headers: headerApi(token),
      })
      .then((res) => {
        setLoading(false);
        setOpen(false);
        handleCloseMenu();
        setAboutUs((prev) => ({
          ...prev,
          description: values.description,
          name: values.name,
          count: values.count,
          attribute1: values.attribute1,
          attribute2: values.attribute2,
          attribute3: values.attribute3,
          attribute4: values.attribute4,
        }));
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('Error, please try again');
        }
        if (error.response.status === 401) {
          dispatch(logoutUser());
        }
      });
  };

  const dispatch = useDispatch();

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" color="primary.main">
          {'Update AboutUs Info'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ marginTop: '20px' }}>
            <Grid item md={6} xs={12}>
              <TextField
                color="primary"
                fullWidth
                label="Name"
                name="name"
                required
                value={values.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                type="number"
                color="primary"
                fullWidth
                label="Count"
                name="count"
                required
                value={values.count}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                color="primary"
                fullWidth
                label="Description"
                name="description"
                required
                value={values.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                color="primary"
                fullWidth
                label="Founder"
                name="attribute1"
                required
                value={values.attribute1}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                color="primary"
                fullWidth
                label="Experience"
                name="attribute2"
                required
                value={values.attribute2}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                color="primary"
                fullWidth
                label="The best coach"
                name="attribute3"
                required
                value={values.attribute3}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                color="primary"
                fullWidth
                label="Address"
                name="attribute4"
                required
                value={values.attribute4}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <LoadingButton loading={loading} onClick={handleSendApi} autoFocus color="primary">
            Agree
          </LoadingButton>
        </DialogActions>
        {errorMessage && (
          <Typography variant="h6" sx={{ color: 'red', padding: '10px 20px', textAlign: 'center' }}>
            {errorMessage}
          </Typography>
        )}
      </Dialog>
    </>
  );
};

export default UpdateAboutUs;
