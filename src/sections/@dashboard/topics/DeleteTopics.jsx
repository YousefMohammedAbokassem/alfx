import { LoadingButton } from '@mui/lab'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import axios from 'axios'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { headerApi } from 'src/utils/headerApi'

const DeleteTopics = ({open, handleClose, setData, id, setAnchorEl}) => {
    const {token} = useSelector(state => state.auth)

    const [deleteLoading, setDeleteLoading] = useState(false)

    
  const handleDelete = () => {
    setDeleteLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/topics/delete/${id}`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setDeleteLoading(false);
        setData((prev) => prev.filter((el) => el.id !== id));
        setAnchorEl(null);
        handleClose()
      })
      .catch((error) => {
        console.log(error);
        setDeleteLoading(false);
      });
  };


  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Topic"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you need to delete this qr
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <LoadingButton onClick={handleDelete} loading={deleteLoading} autoFocus>
            Agree
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DeleteTopics