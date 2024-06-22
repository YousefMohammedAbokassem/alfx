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
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';

const UpdateTeacher = ({ open, setOpen, setData, handleCloseMenu, element }) => {
  console.log(element);

  const { token } = useSelector((state) => state.auth);
  const handleClose = () => {
    setOpen(false);
    setErrorMessage('');
    setValues({
      phone: '',
      name: '',
      city_id: '',
      specialization: '',
      description: '',
      telegram_link: '',
      youtube_link: '',
    });
  };

  const [values, setValues] = useState({
    phone: '',
    name: '',
    city_id: '',
    specialization: '',
    description: '',
    telegram_link: '',
    youtube_link: '',
  });

  useEffect(() => {
    if (element) {
      setValues({
        phone: element.phone || '',
        name: element.name || '',
        city_id: element.city_id || '',
        specialization: element.specialization || '',
        description: element.description || '',
        telegram_link: element.telegram_link || '',
        youtube_link: element.youtube_link || '',
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

  const [selecteFile, setSelectFile] = useState({});
  const [imageUrl, setImageUrl] = useState('');

  const handleOpenFile = () => {
    fileInputRef.current.click();
  };

  const handleSelectFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectFile(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
      console.log(e.target.files[0]);
      console.log(URL.createObjectURL(e.target.files[0]));
      console.log(element.image);
    }
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleSendApi = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('phone', values.phone);
    formData.append('name', values.name);
    formData.append('city_id', values.city_id);
    formData.append('specialization', values.specialization);
    formData.append('description', values.description);
    formData.append('telegram_link', values.telegram_link);
    formData.append('youtube_link', values.youtube_link);
    formData.append('file', selecteFile);
    formData.append('id', element.id);

    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    axios
      .post(`${process.env.REACT_APP_API_URL}admin/teachers/update`, formData, {
        headers: headerApi(token),
      })
      .then((res) => {
        console.log(res);
        setLoading(false);
        setOpen(false);
        handleCloseMenu();
        setData((prev) =>
          prev.map((admin) =>
            admin.id === element.id
              ? {
                  ...admin,
                  phone: values.phone,
                  name: values.name,
                  city_id: values.city_id,
                  specialization: values.specialization,
                  description: values.description,
                  telegram_link: values.telegram_link,
                  youtube_link: values.youtube_link,
                  image: imageUrl,
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
          setErrorMessage('Error, please try again');
        }
      });
  };

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
        <DialogTitle id="alert-dialog-title">{'Update Teacher Info'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ marginTop: '20px' }}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Phone" required name="phone" value={values.phone} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Name" name="name" value={values.name} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="City" select name="city_id" value={values.city_id} onChange={handleChange}>
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
                required
                name="specialization"
                value={values.specialization}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Description"
                multiline
                required
                name="description"
                multiline
                value={values.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telegram"
                required
                name="telegram_link"
                value={values.telegram_link}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Youtube"
                required
                name="youtube_link"
                value={values.youtube_link}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
              <label htmlFor="file">
                <Button variant="contained" onClick={handleOpenFile}>
                  Image
                </Button>
              </label>
              <input id="file" type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={handleSelectFile} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <LoadingButton loading={loading} onClick={handleSendApi} autoFocus>
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

export default UpdateTeacher;
