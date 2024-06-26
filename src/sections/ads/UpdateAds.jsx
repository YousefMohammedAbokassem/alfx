import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';

const UpdateAds = ({ open, handleClose, selectedElement, setData }) => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [successMessage, setSuccessMessage] = useState('');

  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (selectedElement) {
      setUrl(selectedElement.url);
      setTitle(selectedElement.title);
      setBody(selectedElement.body);
    }
  }, [selectedElement]);

  //handle file
  const fileInputRef = useRef(null);
  const [selecteFile, setSelectFile] = useState(null);

  const handleOpenFile = () => {
    fileInputRef.current.click();
  };

  const handleSelectFile = (e) => {
    setSelectFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(url);
    console.log(selecteFile);

    setLoading(true);
    const formData = new FormData();

    formData.append('url', url);
    formData.append('title', title);
    formData.append('body', body);
    formData.append('file', selecteFile);
    formData.append('id', selectedElement.id);

    axios
      .post(`${process.env.REACT_APP_API_URL}admin/ads/update`, formData, {
        headers: headerApi(token),
      })
      .then((res) => {
        console.log(res);
        handleClose();
        setLoading(false);
        setSelectFile(null);
        setData((prev) =>
          prev.map((ads) =>
            ads.id === selectedElement.id
              ? {
                  ...ads,
                  file: res.data.ad.file,
                  url: res.data.ad.url,
                  title: title,
                  body: body,
                }
              : ads
          )
        );
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response.status === 400) {
          console.log('hello');
          setErrorMessage(err.response.data.error);
        } else {
          setErrorMessage('Error, please try again');
        }
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
        <DialogTitle id="alert-dialog-title">{'Update Advertise'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3} sx={{ marginTop: '20px' }}>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  label="Body"
                  name="body"
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  label="url"
                  name="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={12} sx={{ position: 'relative' }}>
                <label htmlFor="file">
                  <Button variant="contained" onClick={handleOpenFile}>
                    Image
                  </Button>
                </label>
                <input
                  id="file"
                  type="file"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleSelectFile}
                />
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

export default UpdateAds;
