import { Dialog,Button,Typography,   DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';

const DeleteProduct = ({open,setOpen, id, setProducts}) => {
    const {token} = useSelector(state => state.auth)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleClose = () => {
        setOpen(false)
        setErrorMessage("")
    }

    const handleDelete = () => {
        setLoading(true)
        axios.get(`${process.env.REACT_APP_API_URL}dashboard/products/delete/${id}`, 
        {
            headers: headerApi(token)
        })
        .then(res => {
            setLoading(false)
            handleClose()
            setProducts(prev => prev.filter(el => el.id !== id))
        })
        .catch(error => {
            console.log(error)
            setLoading(false)
            setErrorMessage("Connection Failed")
        })
    }


  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Product"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure ! You need to delete product
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleDelete} autoFocus>
            {loading ? <CircularProgress size={20} /> : "Agree"}
          </Button>
        </DialogActions>
        {
            errorMessage &&
            <Typography variant='h6' sx={{color: "red", padding: "10px 20px"}}>{errorMessage}</Typography>
        }
      </Dialog>
    </>
  );
};

export default DeleteProduct;
