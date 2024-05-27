import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';

const UpdateQr = ({ open, handleClose, setData, element, handleCloseMenu }) => {
  const { token } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      id: '',
      pos_id: '',
      user_device_id: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('id', values.id);
      formData.append('pos_id', values.pos_id.split('-')[0]);
      formData.append('user_device_id', values.user_device_id);

      axios
        .post(`${process.env.REACT_APP_API_URL}admin/qr_codes/update`, formData, {
          headers: headerApi(token)
        })
        .then((res) => {
          setLoading(false);
          setSuccessMessage('Updated Successfuly');
          handleCloseMenu()
          handleClose()
          setData((prev) =>
            prev.map((admin) =>
              admin.pos.id === element.pos.id
                ? {
                    ...admin,
                    user_device_id: values.user_device_id,
                    pos: {
                      ...admin.pos,
                      id: values.pos_id.split('-')[0],
                      name: values.pos_id.split('-')[1],
                    },
                  }
                : admin
            )
          );
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          setErrorMessage('Error please try again');
        });
    },
  });

  useEffect(() => {
    if (element) {
      formik.setValues({
        id: element.id || '',
        pos_id: element.pos ? `${element.pos.id}-${element.pos.name}` : '',
        user_device_id: element.user_device_id || '',
      });
    }
  }, [element, formik.setValues]);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [successMessage, setSuccessMessage] = useState('');

  const [pos, setPos] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/pos`, {
        headers: headerApi(token)
      })
      .then((res) => {
        setPos(res.data.pos);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle id="alert-dialog-title">{'Update Qr Code'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ marginTop: '20px' }}>
              <Grid item xs={12} md={6}>
              <TextField
                  id="outlined-select-currency"
                  label="User device id"
                  name="user_device_id"
                  required
                  value={formik.values.user_device_id}
                  onChange={formik.handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ minWidth: '300px' }}>
                <TextField
                  id="outlined-select-currency"
                  select
                  label="Select Pos"
                  name="pos_id"
                  required
                  value={formik.values.pos_id}
                  onChange={formik.handleChange}
                  fullWidth
                >
                  {pos.map((element, index) => (
                    <MenuItem key={index} value={`${element.id}-${element.name}`}
                        >
                      {element.name}
                    </MenuItem>
                  ))}
                </TextField>
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

export default UpdateQr;
