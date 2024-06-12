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
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { headerApi } from 'src/utils/headerApi';

const AddMcq = ({ open, setOpen, setData, setLoadingData }) => {
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleClose = () => {
    setOpen(false);
    setQuestions([
      { question: '', answer_one: '', answer_two: '', answer_three: '', answer_four: '', selectedAnswer: '' },
    ]);
    setErrorMessage('');
    setSuccessMessage('');
  };

  //handle add question
  const [questions, setQuestions] = useState([
    { question: '', answer_one: '', answer_two: '', answer_three: '', answer_four: '', selectedAnswer: '' },
  ]);

  const handleChange = (e, i) => {
    const { name, value } = e.target;
    const updatedQuestions = [...questions];
    updatedQuestions[i] = {
      ...updatedQuestions[i],
      [name]: value,
    };
    setQuestions(updatedQuestions);
  };

  const handleDelete = (i) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(i, 1);
    setQuestions(updatedQuestions);
  };

  const handleAdd = () => {
    const updatedQuestions = [...questions];
    updatedQuestions.push({
      question: '',
      answer_one: '',
      answer_two: '',
      answer_three: '',
      answer_four: '',
      selectedAnswer: '',
    });
    setQuestions(updatedQuestions);
  };

  const checkFormValidity = () => {
    for (const item of questions) {
      if (
        item.question === '' ||
        item.answer_one === '' ||
        item.answer_two === '' ||
        item.answer_three === '' ||
        item.answer_four === '' ||
        item.selectedAnswer === ''
      ) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(questions);
    const formData = new FormData();
    questions.forEach((element, index) => {
      formData.append(`mcq[${index}][lecture_id]`, id);
      formData.append(`mcq[${index}][question]`, element.question);
      formData.append(`mcq[${index}][options][0][text]`, element.answer_one);
      formData.append(`mcq[${index}][options][0][is_correct]`, element.selectedAnswer === 'radio_1' ? '1' : '0');
      formData.append(`mcq[${index}][options][1][text]`, element.answer_two);
      formData.append(`mcq[${index}][options][1][is_correct]`, element.selectedAnswer === 'radio_2' ? '1' : '0');
      formData.append(`mcq[${index}][options][2][text]`, element.answer_three);
      formData.append(`mcq[${index}][options][2][is_correct]`, element.selectedAnswer === 'radio_3' ? '1' : '0');
      formData.append(`mcq[${index}][options][3][text]`, element.answer_four);
      formData.append(`mcq[${index}][options][3][is_correct]`, element.selectedAnswer === 'radio_4' ? '1' : '0');
    });

    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    axios
      .post(`${process.env.REACT_APP_API_URL}admin/mcq/create`, formData, {
        headers: headerApi(token),
      })
      .then((res) => {
        setLoading(false);
        console.log(res);
        setLoadingData(true);
        axios
          .get(`${process.env.REACT_APP_API_URL}admin/mcq/lecture/${id}`, {
            headers: headerApi(token),
          })
          .then((res) => {
            console.log(res);
            setData(res.data.mcq);
            setLoadingData(false);
            setOpen(false);
          })
          .catch((error) => {
            console.log(error);
            setLoadingData(false);
            setErrorMessage('Connection faild');
          });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        if (error.response) {
          setErrorMessage(error.response.data.error);
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
        <form onSubmit={handleSubmit}>
          <FormControl>
            <DialogTitle id="alert-dialog-title">{'Add Mcq'}</DialogTitle>
            <DialogContent>
              {questions.map((val, index) => (
                <RadioGroup key={index} value={val.selectedAnswer} onChange={(e) => handleChange(e, index)}>
                  <Grid container spacing={3} sx={{ marginTop: '20px', position: 'relative' }}>
                    <Grid item xs={12} md={12}>
                      <TextField
                        fullWidth
                        label="Question"
                        name="question"
                        required
                        value={questions.question}
                        onChange={(e) => handleChange(e, index)}
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
                        name="answer_one"
                        required
                        value={questions.answer_one}
                        onChange={(e) => handleChange(e, index)}
                      />
                      <FormControlLabel
                        control={<Radio />}
                        name={`selectedAnswer`}
                        value="radio_1"
                        checked={val.selectedAnswer === 'radio_1'}
                        onChange={(e) => handleChange(e, index)}
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
                        label="Answer Two"
                        name="answer_two"
                        required
                        value={questions.answer_two}
                        onChange={(e) => handleChange(e, index)}
                      />
                      <FormControlLabel
                        control={<Radio />}
                        name={`selectedAnswer`}
                        value="radio_2"
                        checked={val.selectedAnswer === 'radio_2'}
                        onChange={(e) => handleChange(e, index)}
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
                        name="answer_three"
                        required
                        value={questions.answer_three}
                        onChange={(e) => handleChange(e, index)}
                      />
                      <FormControlLabel
                        control={<Radio />}
                        name={`selectedAnswer`}
                        value="radio_3"
                        checked={val.selectedAnswer === 'radio_3'}
                        onChange={(e) => handleChange(e, index)}
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
                        label="answer_Four"
                        name="answer_four"
                        required
                        value={questions.answer_four}
                        onChange={(e) => handleChange(e, index)}
                      />
                      <FormControlLabel
                        control={<Radio />}
                        name={`selectedAnswer`}
                        value="radio_4"
                        checked={val.selectedAnswer === 'radio_4'}
                        onChange={(e) => handleChange(e, index)}
                      />
                    </Grid>
                    {questions.length === 1 ? (
                      ''
                    ) : (
                      <Button
                        variant="outlined"
                        sx={{ position: 'absolute', right: '0', top: '-1px', padding: '0' }}
                        onClick={() => handleDelete(index)}
                      >
                        x
                      </Button>
                    )}
                  </Grid>
                </RadioGroup>
              ))}
              <Button variant="contained" sx={{ mt: 4 }} onClick={handleAdd} disabled={!checkFormValidity()}>
                +
              </Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Disagree</Button>
              <LoadingButton type="submit" loading={loading} autoFocus>
                Agree
              </LoadingButton>
            </DialogActions>
          </FormControl>
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

export default AddMcq;
