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
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { headerApi } from 'src/utils/headerApi';

const AddQr = ({ open, setOpen, setData }) => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams()

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [count, setCount] = useState('');

  const handleClose = () => {
    setOpen(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleAdd = () => {
    setLoading(true);

    const formData = new FormData();
    formData.append('pos_id', selectedPos);
    formData.append('course_id', id);
    formData.append('count', count);

    setErrorMessage("")
    setSuccessMessage("")


    axios
      .post(`${process.env.REACT_APP_API_URL}admin/qr_codes/create`, formData, {
        headers: headerApi(token),
      })
      .then((res) => {
        setOpen(false)
        setSelectedPos("")
        setCount("")
        axios
        .get(`${process.env.REACT_APP_API_URL}admin/qr_codes/course/${id}`, {
          headers: headerApi(token),
        })
        .then((res) => {
          setLoading(false);
          setData(res.data.qr_codes);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
      })
      .catch((error) => {
        console.log(error);
        if(error.response){
          setErrorMessage(error.response.data.error)
        }else{
          setErrorMessage("Error, please try again")
        }
        setLoading(false);
      });
  };

  const [pos, setPos] = useState([]);

  const [selectedPos, setSelectedPos] = useState('');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/pos`, {
        headers: headerApi(token),
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
        <DialogTitle id="alert-dialog-title">{`Add Qr to Course: ${searchParams.get("name")}`}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{  mt: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                id="outlined-select-currency"
                select
                label="Select point of sale"
                name="teacher_id"
                required
                value={selectedPos}
                onChange={(e) => setSelectedPos(e.target.value)}
                fullWidth
              >
                {pos.map((element, index) => (
                  <MenuItem key={index} value={element.id}>
                    {element.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="outlined-select-currency"
                label="Count"
                name="count"
                required
                value={count}
                onChange={(e) => setCount(e.target.value)}
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

export default AddQr;
