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
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from 'src/store/authSlice';
import { headerApi } from 'src/utils/headerApi';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const recommendation = [
  { name: 'True', value: 1 },
  { name: 'False', value: 0 },
];
const AddCategory = ({ open, setOpen, setData, handleCloseMenu }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleClose = () => {
    setOpen(false);
    handleCloseMenu();
    formik.resetForm();
    setErrorMessage('');
    setSuccessMessage('');
  };

  // handle file
  const fileInputRef = useRef(null);
  const [selecteFile, setSelectFile] = useState(null);

  const handleOpenFile = () => {
    fileInputRef.current.click();
  };

  const handleSelectFile = (e) => {
    setSelectFile(e.target.files[0]);
  };

  const formik = useFormik({
    initialValues: {
      key: '',
      value: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('key', values.key);
      formData.append('value', values.value);

      axios
        .post(`${process.env.REACT_APP_API_URL}admin/recommendation-category/index`, formData, {
          headers: headerApi(token),
        })
        .then((res) => {
          setLoading(false);
          setSuccessMessage('Added Success');
          // let none = false;
          setData((prev) => [...prev, res.data.data]);

          // if (!none) {
          // }
          handleClose();
        })
        .catch((error) => {
          if (error.response) {
            setErrorMessage(error.response.data.message);
          } else {
            setErrorMessage('Error, please try again');
          }
          if (error.response.status === 401) {
            dispatch(logoutUser());
          }
          setLoading(false);
        });
    },
  });
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(value);
  };
  // const [recommendation, setRecommendation] = useState([]);
  const fetchData = () => {
    // setLoadingData(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/courses`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setCourses(res.data.courses);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          dispatch(logoutUser());
        }
      });
  };
  console.log(personName);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  console.log(selectedCourses);
  const handleCoursesChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCourses(typeof value === 'string' ? value.split(',') : value);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" color="primary.main">
          {'Add QrCode'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={3} sx={{ marginTop: '20px', minWidth: '400px' }}>
              <Grid item xs={12}>
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel id="demo-checkbox-label">Recommendation</InputLabel>
                  <Select
                    labelId="demo-checkbox-label"
                    id="demo-checkbox"
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput label="Recommendation" />}
                    renderValue={(selected) => recommendation.find((item) => item.value === selected)?.name || ''}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 224,
                          width: 250,
                        },
                      },
                    }}
                  >
                    {recommendation.map((item) => (
                      <MenuItem key={item.name} value={item.value}>
                        <Checkbox checked={item.value === personName} disabled />
                        <ListItemText primary={item.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ width: '100%', marginTop: '16px' }}>
                  <InputLabel id="courses-multiple-checkbox-label">Courses</InputLabel>
                  <Select
                    labelId="courses-multiple-checkbox-label"
                    id="courses-multiple-checkbox"
                    multiple
                    value={selectedCourses}
                    onChange={handleCoursesChange}
                    input={<OutlinedInput label="Courses" />}
                    renderValue={(selected) =>
                      selected.map((id) => courses.find((item) => item.id === id)?.name).join(', ')
                    }
                    MenuProps={MenuProps}
                  >
                    {courses?.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        <Checkbox checked={selectedCourses.indexOf(item.id) > -1} />
                        <ListItemText primary={item.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Disagree
            </Button>
            <LoadingButton type="submit" loading={loading} autoFocus color="primary">
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

export default AddCategory;
