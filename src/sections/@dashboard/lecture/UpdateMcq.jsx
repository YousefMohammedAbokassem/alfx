import { LoadingButton } from '@mui/lab';
import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  FormControlLabel,
  Radio,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { headerApi } from 'src/utils/headerApi';

const UpdateMcq = ({ open, setData, handleClose, element }) => {
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('id', element.id);
    formData.append('text', values.question);
    formData.append(`options[0][id]`, element.options[0].id);
    formData.append(`options[0][text]`, values.answer_1);
    formData.append(`options[0][is_correct]`, values.selectedAnswer === 'radio_1' ? '1' : '0');
    formData.append(`options[1][id]`, element.options[1].id);
    formData.append(`options[1][text]`, values.answer_2);
    formData.append(`options[1][is_correct]`, values.selectedAnswer === 'radio_2' ? '1' : '0');
    formData.append(`options[2][id]`, element.options[2].id);
    formData.append(`options[2][text]`, values.answer_3);
    formData.append(`options[2][is_correct]`, values.selectedAnswer === 'radio_3' ? '1' : '0');
    formData.append(`options[3][id]`, element.options[3].id);
    formData.append(`options[3][text]`, values.answer_4);
    formData.append(`options[3][is_correct]`, values.selectedAnswer === 'radio_4' ? '1' : '0');

    axios
      .post(`${process.env.REACT_APP_API_URL}admin/mcq/update`, formData, {
        headers: headerApi(token),
      })
      .then((res) => {
        console.log(res);
        setLoading(false);
        setSuccessMessage("Updated Success")
        const updatedOptions = element.options.map((option, index) => ({
          ...option,
          text: values[`answer_${index + 1}`],
          is_correct: values.selectedAnswer === `radio_${index + 1}` ? 1 : 0,
        }));
        handleClose()
        setData((prev) =>
          prev.map((admin) =>
            admin.id === element.id
              ? {
                  ...admin,
                  text: values.question,
                  options: updatedOptions,
                }
              : admin
          )
        );
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        if(error.response){
          setErrorMessage(error.response.data.message)
        }
        else{
          setErrorMessage("Error, please try again")
        }
      });
  };

  const [values, setValues] = useState({
    question: '',
    answer_1: '',
    answer_2: '',
    answer_3: '',
    answer_4: '',
    selectedAnswer: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (element && element.options && element.options.length > 0) {
      setValues({
        question: element.text || '',
        answer_1: element.options[0].text || '',
        answer_2: element.options[1].text || '',
        answer_3: element.options[2].text || '',
        answer_4: element.options[3].text || '',
        selectedAnswer: `radio_${element.options.findIndex((option) => option.is_correct === 1) + 1}` || '',
      });
    }
  }, [element]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle id="alert-dialog-title">{'Update Mcq'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ marginTop: '20px' }}>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  label="Question"
                  name="question"
                  required
                  value={values.question}
                  onChange={handleChange}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={12}
                style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse' }}
              >
                <TextField
                  fullWidth
                  label="Answer One"
                  name="answer_1"
                  required
                  value={values.answer_1}
                  onChange={handleChange}
                />
                <FormControlLabel
                  control={<Radio />}
                  name={`selectedAnswer`}
                  value="radio_1"
                  checked={values.selectedAnswer === 'radio_1'}
                  onChange={handleChange}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={12}
                style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse' }}
              >
                <TextField
                  fullWidth
                  label="Answer two"
                  name="answer_2"
                  required
                  value={values.answer_2}
                  onChange={handleChange}
                />
                <FormControlLabel
                  control={<Radio />}
                  name={`selectedAnswer`}
                  value="radio_2"
                  checked={values.selectedAnswer === 'radio_2'}
                  onChange={handleChange}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={12}
                style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse' }}
              >
                <TextField
                  fullWidth
                  label="Answer Three"
                  name="answer_3"
                  required
                  value={values.answer_3}
                  onChange={handleChange}
                />
                <FormControlLabel
                  control={<Radio />}
                  name={`selectedAnswer`}
                  value="radio_3"
                  checked={values.selectedAnswer === 'radio_3'}
                  onChange={handleChange}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={12}
                style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse' }}
              >
                <TextField
                  fullWidth
                  label="Answer Four"
                  name="answer_4"
                  required
                  value={values.answer_4}
                  onChange={handleChange}
                />
                <FormControlLabel
                  control={<Radio />}
                  name={`selectedAnswer`}
                  value="radio_4"
                  checked={values.selectedAnswer === 'radio_4'}
                  onChange={handleChange}
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

export default UpdateMcq;
