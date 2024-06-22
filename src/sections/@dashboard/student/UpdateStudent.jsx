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
  FormControlLabel,
  Switch,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from 'src/store/authSlice';
import { headerApi } from 'src/utils/headerApi';

const UpdateTeacher = ({ open, setOpen, students, setStudents, handleCloseMenu, element }) => {
  const { token } = useSelector((state) => state.auth);

  const handleClose = () => {
    setOpen(false);
    setErrorMessage('');
    setValues({
      name: '',
      phone: '',
      email: '',
      blocked: '',
      device_id: '',
    });
  };

  const [values, setValues] = useState({
    name: '',
    phone: '',
    email: '',
    blocked: '',
    device_id: '',
  });

  const [clearDeviceId, setClearDeviceId] = useState(false);

  useEffect(() => {
    if (element) {
      setValues({
        name: element.name || '',
        email: element.email || '',
        phone: element.phone || '',
        blocked: element.blocked !== undefined ? element.blocked : '',
        device_id: element.device_id || '',
      });
    }
  }, [element]);

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSwitchChange = (e) => {
    setClearDeviceId(e.target.checked);
    if (e.target.checked) {
      setValues((prev) => ({
        ...prev,
        device_id: '',
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        device_id: element.device_id || '',
      }));
    }
  };

  const fileInputRef = useRef(null);

  const [selecteFile, setSelectFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleOpenFile = () => {
    fileInputRef.current.click();
  };

  const handleSelectFile = (e) => {
    setSelectFile(e.target.files[0]);
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
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('phone', values.phone);
    formData.append('blocked', values.blocked);
    formData.append('device_id', clearDeviceId ? null : values.device_id); // Update this line

    axios
      .post(`${process.env.REACT_APP_API_URL}admin/users/update/${element.id}`, formData, {
        headers: headerApi(token),
      })
      .then((res) => {
        setLoading(false);
        setOpen(false);
        handleCloseMenu();
        setStudents((prev) =>
          prev.map((admin) => {
            if (admin.id === element.id) {
              return {
                ...admin,
                name: values.name,
                email: values.email,
                phone: values.phone,
                blocked: values.blocked,
                device_id: clearDeviceId ? null : values.device_id,
              };
            } else {
              return admin;
            }
          })
        );
      })
      .catch((error) => {
        setLoading(false);
        console.log(error)
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
          {'Update Info'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ marginTop: '20px' }}>
            <Grid item xs={12}>
              <TextField
                color="primary"
                fullWidth
                label="Name"
                required
                name="name"
                value={values.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                color="primary"
                fullWidth
                label="Email"
                required
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                color="primary"
                fullWidth
                label="Phone"
                required
                name="phone"
                type="tel"
                value={values.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                color="primary"
                fullWidth
                label="Blocked"
                required
                name="blocked"
                value={values.blocked}
                onChange={handleChange}
              >
                <MenuItem value={1}>Available</MenuItem>
                <MenuItem value={0}>Unavailable</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={clearDeviceId} onChange={handleSwitchChange} />}
                label="Clear Device id"
                sx={{ mb: 1 }}
              />
              <TextField
                color="primary"
                fullWidth
                label="Device id"
                required
                name="device_id"
                value={values.device_id}
                onChange={handleChange}
                InputProps={{
                  readOnly: clearDeviceId,
                }}
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

export default UpdateTeacher;
