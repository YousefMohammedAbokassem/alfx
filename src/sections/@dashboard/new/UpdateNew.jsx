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

const UpdateNew = ({ open, setOpen, news, setNews, handleCloseMenu, element }) => {
  const { token } = useSelector((state) => state.auth);
  const handleClose = () => {
    setOpen(false);
    setErrorMessage('');
    setValues({
      title: '',
      description: '',
      image: '',
    });
  };

  const [values, setValues] = useState({
    title: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    if (element) {
      setValues({
        title: element.title || '',
        description: element.description || '',
        image: element.image || '',
      });
    }
  }, [element]);

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleOpenFile = () => {
    fileInputRef.current.click();
  };

  const handleSelectFile = (e) => {
    setSelectedFile(e.target.files[0]);
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
    formData.append('title', values.title);
    formData.append('description', values.description);
    if (selectedFile !== null) {
      formData.append('image', selectedFile);
    }
    axios
      .post(`${process.env.REACT_APP_API_URL}admin/news/update/${element.id}`, formData, {
        headers: headerApi(token),
      })
      .then((res) => {
        setLoading(false);
        setOpen(false);
        handleCloseMenu();
        setNews((prev) =>
          prev.map((item) => {
            if (item.id === element.id) {
              return {
                ...item,
                title: values.title,
                description: values.description,
                // images: [...item.images, { image: imageUrl }],
                images: '',
              };
            } else {
              return item;
            }
          })
        );
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          setErrorMessage(error.response.data.error);
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
          {'Update News Info'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ marginTop: '20px' }}>
            <Grid item xs={12} md={6}>
              <TextField
                color="primary"
                fullWidth
                label="Title"
                required
                name="title"
                value={values.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                color="primary"
                fullWidth
                label="Description"
                required
                name="description"
                value={values.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
              <label htmlFor="file">
                <Button variant="contained" onClick={handleOpenFile} color="primary" sx={{ color: '#fff' }}>
                  Image
                </Button>
              </label>
              <input id="file" type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={handleSelectFile} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <LoadingButton loading={loading} onClick={handleSendApi} autoFocus color="primary">
            Update
          </LoadingButton>
        </DialogActions>
        {errorMessage && (
          <Typography
            variant="h6"
            sx={{
              color: 'red',
              padding: '10px 20px',
              textAlign: 'center',
            }}
          >
            {errorMessage}
          </Typography>
        )}
      </Dialog>
    </>
  );
};

export default UpdateNew;
