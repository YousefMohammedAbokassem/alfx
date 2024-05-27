import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Typography, Stack, IconButton, InputAdornment, TextField, CircularProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { login, changeError } from '../../../store/authSlice';
// components
import Iconify from '../../../components/iconify';
// import { clearConfigCache } from 'prettier';
// import {changeError} from "../../../store/authSlice"

// -----------------------------------------------------------------------

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const [values, setValeus] = useState({
    email: '',
    password: '',
    fcm_token: "666"
  });

  const handleChange = (e) => {
    setValeus((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClick = (e) => {
    e.preventDefault();
    dispatch(login(values))
    .then((res) => {
      if (res.payload.msg === 'Successful login') {
        setValeus({
          email: '',
          password: '',
        });
        navigate('/dashboard', { replace: true });
      } else {
      }
    });
  };

  useEffect(() => {
    dispatch(changeError(''));
  }, [values]);

  return (
    <>
      <form onSubmit={handleClick}>
        <Stack spacing={3}>
          <TextField required name="email" label="Email" value={values.email} onChange={handleChange} />

          <TextField
            name="password"
            required
            label="Password"
            value={values.password}
            onChange={handleChange}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" sx={{ my: 2 }}>
          {loading ? <CircularProgress sx={{ color: '#fff' }} /> : 'Login'}
        </LoadingButton>
        {error && (
          <Typography variant="h6" sx={{ color: 'red', padding: '10px 20px', textAlign: 'center' }}>
            {error}
          </Typography>
        )}
      </form>
    </>
  );
}
