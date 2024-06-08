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

const UpdateTeacher = ({
  idCategory,
  id,
  open,
  setOpen,
  categories,
  setCategories,
  handleCloseMenu,
  element,
  fetchData,
}) => {
  const { token } = useSelector((state) => state.auth);
  // setCategories([]);
  // console.log(categories, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  const handleClose = () => {
    setOpen(false);
    setErrorMessage('');
    setValues({
      name: '',
      description: '',
      image: '',
    });
  };

  const [values, setValues] = useState({
    name: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    if (element) {
      setValues({
        name: element.name || '',
        description: element.description || '',
        image: element.image || '',
      });
    }
  }, [element]);
  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // handle file
  const fileInputRef = useRef(null);
  const [selecteFile, setSelectFile] = useState([]);
  const videoRef = useRef(null);
  const [selecteVideo, setSelectVideo] = useState([]);
  const handleOpenFile = () => {
    fileInputRef.current.click();
  };
  const handleOpenVideo = () => {
    videoRef.current.click();
  };

  const handleSelectFile = (e) => {
    setSelectFile(e.target.files);
  };

  const handleSelectVideo = (e) => {
    setSelectVideo(e.target.files);
  };
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get(`${process.env.REACT_APP_API_URL}admin/recommendation/index/${idCategory}`, {
  //       headers: headerApi(token),
  //     });
  //     setLoading(false);

  //     setCategories(res.data.data);
  //     console.log(res.data.data, 'aaaaaaaaaaaaaaaaaaa');
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //   }
  // };
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
        // setCategories((prev) =>
        //   prev.map((admin) => {
        //     console.log(admin, 'ASDASDASDASDADADASDASD');
        //     console.log(prev, 'ASDASDASDASDADADASDASD');
        //     console.log([...selecteFile], 'JSON.stringify([...selecteFile])');
        //     if (admin.id == element.id) {
        //       return {
        //         ...admin,
        //         description: values.description,
        //         images: [],
        //         videos: [],
        //       };
        //     } else {
        //       return admin;
        //     }
        //   })
        // );
        fetchData();
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        if (error.response) {
          setErrorMessage(error.response.data.message);
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

export default UpdateTeacher;
