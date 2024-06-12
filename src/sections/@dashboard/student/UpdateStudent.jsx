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

const UpdateTeacher = ({ open, setOpen, students, setStudents, handleCloseMenu, element }) => {
  const { token } = useSelector((state) => state.auth);
  const handleClose = () => {
    setOpen(false);
    setErrorMessage('');
    setValues({
      name: '',
    });
  };
  console.log(element);
  const [values, setValues] = useState({
    name: '',
  });

  useEffect(() => {
    if (element) {
      setValues({
        name: element.name || '',
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
    axios
      .post(`${process.env.REACT_APP_API_URL}admin/recommendation-student/update/${element.id}`, formData, {
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
              };
            } else {
              return admin;
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
