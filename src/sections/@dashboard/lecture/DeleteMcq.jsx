import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';

const DeleteMcq = ({open, handleClose, id, setData}) => {

  const {token} = useSelector(state => state.auth)

  const [loading, setLoading] = useState(false)

    const handleDelete = () => {
      setLoading(true)
        axios.get(`${process.env.REACT_APP_API_URL}admin/mcq/delete/${id}`, {
          headers: headerApi(token)
        })
        .then(res => {
          setLoading(false)
          handleClose()
          setData(prev => prev.filter(element => element.id !== id));
        })
        .catch(error => {
          console.log(error)
          setLoading(false)
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
          <DialogTitle id="alert-dialog-title">{"Are yoy sure!"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Delete this will remove all information related to it
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <LoadingButton loading={loading} onClick={handleDelete} autoFocus>
              Agree
            </LoadingButton>
          </DialogActions>
        </Dialog>
    </>
  );
};

export default DeleteMcq;