import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Grid,
  TextField,
} from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';

const AddTopics = ({ open, setOpen, setData }) => {
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleClose = () => {
    setOpen(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleAdd = () => {
    setLoading(true)
   

    axios.post(`${process.env.REACT_APP_API_URL}admin/topics/create`, {name}, {
      headers: headerApi(token)
    })
    .then(res => {
      setLoading(false)
      setSuccessMessage("Addedd Success")
      setData(prev => [...prev, res.data.topic])
    })
    .catch(error => {
      console.log(error)
      setLoading(false)
    })
  }


  const [name, setName] = useState("")
  

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Add Qr'}</DialogTitle>
        <DialogContent>
          <Grid sx={{minWidth: "300px", mt: 2}}>
            <Grid item>
              <TextField
                id="outlined-select-currency"
                label="Name"
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <LoadingButton onClick={handleAdd} loading={loading} autoFocus>
            Agree
          </LoadingButton>
        </DialogActions>
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

export default AddTopics;
