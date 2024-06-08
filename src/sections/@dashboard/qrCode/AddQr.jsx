import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { headerApi } from 'src/utils/headerApi';
import axios from 'axios';
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
  FormControl,
  InputLabel,
  OutlinedInput,
  ListItemText,
  Select,
  Checkbox,
} from '@mui/material';

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

const recommendationOptions = [
  { name: 'True', value: 1 },
  { name: 'False', value: 0 },
];

const AddQrOrCategory = ({ open, setOpen, setData, handleCloseMenu }) => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [qrCount, setQrCount] = useState('');
  const [selectedPos, setSelectedPos] = useState('');
  const [posList, setPosList] = useState([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [recommendation, setRecommendation] = useState('');
  console.log('Selected POS:', selectedPos);
  console.log('Count:', qrCount);
  console.log('Selected Courses:', selectedCourseIds);
  console.log('Recommendation:', recommendation);

  const handleClose = () => {
    setOpen(false);
    setErrorMessage('');
    setSuccessMessage('');
    handleCloseMenu && handleCloseMenu();
  };

  const handleAddQr = () => {
    setLoading(true);

    const formData = new FormData();
    formData.append('pos_id', selectedPos);
    selectedCourseIds.forEach((courseId, index) => {
      formData.append(`course_ids[${index}]`, courseId);
    });
    formData.append('count', qrCount);
    formData.append('with_recommendation', recommendation);

    setErrorMessage('');
    setSuccessMessage('');

    axios
      .post(`${process.env.REACT_APP_API_URL}admin/qr_codes/create`, formData, {
        headers: headerApi(token),
      })
      .then((res) => {
        setOpen(false);
        setSelectedPos('');
        setQrCount('');
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
        if (error.response) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage('Error, please try again');
        }
        setLoading(false);
      });
  };

  const fetchData = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/pos`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setPosList(res.data.pos);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`${process.env.REACT_APP_API_URL}admin/courses`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setCourseList(res.data.courses);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCoursesChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCourseIds(typeof value === 'string' ? value.split(',') : value);
  };

  const handleRecommendationChange = (event) => {
    const {
      target: { value },
    } = event;
    setRecommendation(value);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{`Add Qr to Course: ${searchParams.get('name')}`}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <FormControl sx={{ width: '100%' }}>
              <InputLabel id="recommendation-label">Recommendation</InputLabel>
              <Select
                labelId="recommendation-label"
                id="recommendation-select"
                value={recommendation}
                onChange={handleRecommendationChange}
                input={<OutlinedInput label="Recommendation" />}
                renderValue={(selected) => recommendationOptions.find((item) => item.value === selected)?.name || ''}
                MenuProps={MenuProps}
              >
                {recommendationOptions.map((item) => (
                  <MenuItem key={item.name} value={item.value}>
                    <Checkbox checked={item.value === recommendation} disabled />
                    <ListItemText primary={item.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="pos-select"
              select
              label="Select POS"
              name="pos_id"
              required
              value={selectedPos}
              onChange={(e) => setSelectedPos(e.target.value)}
              fullWidth
            >
              {posList.map((element, index) => (
                <MenuItem key={index} value={element.id}>
                  {element.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="number"
              id="count-input"
              label="Count"
              name="count"
              required
              value={qrCount}
              onChange={(e) => setQrCount(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl sx={{ width: '100%', marginTop: '16px' }}>
              <InputLabel id="courses-multiple-checkbox-label">Courses</InputLabel>
              <Select
                labelId="courses-multiple-checkbox-label"
                id="courses-multiple-checkbox"
                multiple
                value={selectedCourseIds}
                onChange={handleCoursesChange}
                input={<OutlinedInput label="Courses" />}
                renderValue={(selected) =>
                  selected.map((id) => courseList.find((item) => item.id === id)?.name).join(', ')
                }
                MenuProps={MenuProps}
              >
                {courseList?.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    <Checkbox checked={selectedCourseIds.indexOf(item.id) > -1} />
                    <ListItemText primary={item.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>
        <LoadingButton onClick={handleAddQr} loading={loading} autoFocus>
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
  );
};

export default AddQrOrCategory;
