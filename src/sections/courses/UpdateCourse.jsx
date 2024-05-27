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
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { customDecrypt } from 'src/utils/hashingFunction';
import { headerApi } from 'src/utils/headerApi';

const UpdateCourse = ({ element, open, handleClose, onUpdateSuccess }) => {
  const { token } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      introduction_video: '',
      hours: '',
      lectures_count: '',
      chapters_count: '',
      has_test: '',
      has_certificate: '',
      price: '',
      teacher_id: '',
      id: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('introduction_video', values.introduction_video);
      formData.append('hours', values.hours);
      formData.append('lectures_count', values.lectures_count);
      formData.append('chapters_count', values.chapters_count);
      formData.append('has_test', values.has_test);
      formData.append('has_certificate', values.has_certificate);
      formData.append('price', values.price);
      formData.append('id', values.id);
      formData.append('teacher_id', values.teacher_id);
      formData.append('file', selectedFile);

      axios
        .post(`${process.env.REACT_APP_API_URL}admin/courses/update`, formData, {
          headers: headerApi(token),
        })
        .then((res) => {
          setLoading(false);
          setSuccessMessage('Updated Successfuly');
          onUpdateSuccess(res.data.course);
          handleClose();
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
        name: element.name || '',
        description: element.description || '',
        // introduction_video: element.introduction_video || '',
        introduction_video: element.introduction_video ? customDecrypt(element.introduction_video) : '',
        hours: element.hours || '',
        lectures_count: element.lectures_count || '',
        chapters_count: element.chapters_count || '',
        price: element.price || '',
        has_test: element.has_test || '',
        has_certificate: element.has_certificate || '',
        id: element.id || '',
        teacher_id: element.teacher_id || '',
      });
    }
  }, [element, formik.setValues]);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [successMessage, setSuccessMessage] = useState('');

  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/teachers`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setTeachers(res.data.teachers);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

  // handle file 

      //handle file 
      const fileInputRef = useRef(null)

      const [selectedFile, setSelectedFile] = useState(null)

      const handleSelectFile = (e) => {
        setSelectedFile(e.target.files[0])
      }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle id="alert-dialog-title">{'Update Course'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ marginTop: '20px' }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  required
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  required
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Introduction Video"
                  name="introduction_video"
                  required
                  value={formik.values.introduction_video}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Hours"
                  name="hours"
                  type="number"
                  required
                  value={formik.values.hours}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Lectures Count"
                  name="lectures_count"
                  required
                  value={formik.values.lectures_count}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Chapters Count"
                  name="chapters_count"
                  required
                  value={formik.values.chapters_count}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  required
                  value={formik.values.price}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="outlined-select-currency"
                  select
                  label="Has Test"
                  name="has_test"
                  required
                  value={formik.values.has_test}
                  onChange={formik.handleChange}
                  fullWidth
                >
                  <MenuItem value="1">true</MenuItem>
                  <MenuItem value="0">false</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="outlined-select-currency"
                  select
                  label="Has Certificate"
                  name="has_certificate"
                  required
                  value={formik.values.has_certificate}
                  onChange={formik.handleChange}
                  fullWidth
                >
                  <MenuItem value="1">true</MenuItem>
                  <MenuItem value="0">false</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="outlined-select-currency"
                  select
                  label="Teacher"
                  name="teacher_id"
                  required
                  value={formik.values.teacher_id}
                  onChange={formik.handleChange}
                  fullWidth
                >
                  {teachers.map((element, index) => (
                    <MenuItem key={index} value={element.id}>
                      {element.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
                <label htmlFor="file">
                  <Button variant="contained" onClick={() => fileInputRef.current.click()}>
                    File
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

export default UpdateCourse;
