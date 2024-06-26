import { LoadingButton } from '@mui/lab';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from 'src/store/authSlice';
import { headerApi } from 'src/utils/headerApi';

const UpdateRecommendation = ({
  idCategory,
  id,
  open,
  setOpen,
  recommendations,
  setRecommendations,
  handleCloseMenu,
  element,
  fetchData,
}) => {
  const { token } = useSelector((state) => state.auth);

  // إغلاق الحوار وإعادة تعيين القيم
  const handleClose = () => {
    setOpen(false);
    setErrorMessage('');
    setValues({
      name: '',
      description: '',
      image: '',
    });
  };

  // حالة القيم للتوصية
  const [values, setValues] = useState({
    name: '',
    description: '',
    image: '',
  });

  // ملف الصورة
  const fileInputRef = useRef(null);
  const [selecteFile, setSelectFile] = useState([]);

  // ملف الفيديو
  const videoRef = useRef(null);
  const [selecteVideo, setSelectVideo] = useState([]);

  // تحديث قيم التوصية عند تغيير العنصر
  useEffect(() => {
    if (element) {
      setValues({
        name: element.name || '',
        description: element.description || '',
        image: element.image || '',
      });
    }
  }, [element]);

  // تغيير قيم التوصية
  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // فتح حوار اختيار الصورة
  const handleOpenFile = () => {
    fileInputRef.current.click();
  };

  // فتح حوار اختيار الفيديو
  const handleOpenVideo = () => {
    videoRef.current.click();
  };

  // اختيار الصورة
  const handleSelectFile = (e) => {
    setSelectFile(e.target.files);
  };

  // اختيار الفيديو
  const handleSelectVideo = (e) => {
    setSelectVideo(e.target.files);
  };

  // حالة التحميل
  const [loading, setLoading] = useState(false);

  // رسالة الخطأ
  const [errorMessage, setErrorMessage] = useState('');

  // إرسال البيانات إلى الخادم
  const handleSendApi = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('description', values.description);
    formData.append('recommendation_category_id', idCategory);

    [...selecteFile].map((image, i) => {
      formData.append(`images[${i}]`, image);
    });
    [...selecteVideo].map((video, i) => {
      formData.append(`videos[${i}]`, video);
    });
    axios
      .post(`${process.env.REACT_APP_API_URL}admin/recommendation/update/${id}`, formData, {
        headers: headerApi(token),
      })
      .then((res) => {
        setLoading(false);
        setOpen(false);
        handleCloseMenu();
        fetchData();
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
          {'Update Recommendation Info'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ marginTop: '20px' }}>
            <Grid item xs={12}>
              <TextField
                color="primary"
                fullWidth
                label="Description"
                multiline
                name="description"
                required
                value={values.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sx={{ position: 'relative', display: 'flex', gap: '10px' }}>
              <label htmlFor="file">
                <Button variant="contained" onClick={handleOpenFile} color="primary" sx={{ color: '#fff' }}>
                  Images
                </Button>
                <input
                  id="file"
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleSelectFile}
                />
              </label>
              <label htmlFor="file">
                <Button variant="contained" onClick={handleOpenVideo} color="primary" sx={{ color: '#fff' }}>
                  Videos
                </Button>
                <input
                  id="file"
                  type="file"
                  multiple
                  accept="video/mp4, video/mov, video/ogg"
                  style={{ display: 'none' }}
                  ref={videoRef}
                  onChange={handleSelectVideo}
                />
              </label>
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

export default UpdateRecommendation;
