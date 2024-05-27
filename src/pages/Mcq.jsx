import { Container } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import McqQuestion from '../sections/@dashboard/lecture/McqQuestion';

const Mcq = () => {
  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>
      <Container>
        <McqQuestion />
      </Container>
    </>
  );
};

export default Mcq;
