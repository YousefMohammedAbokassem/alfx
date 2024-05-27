import {
  Container,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import CoursesCard from 'src/sections/courses/CoursesCard';
import SkeletonCopm from 'src/components/skeleton-comp';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';

const TeacherDetails = () => {
  const {id} = useParams()
  const {token} = useSelector(state => state.auth)

const [courses, setCourses] = useState([])

useEffect(() => {
  axios.get(`${process.env.REACT_APP_API_URL}admin/teachers/${id}`, {
    headers: headerApi(token)
  })
  .then(res => {
    console.log(res)
    setCourses(res.data.courses)
  })
  .catch(error => {
    console.log(error)
  })
}, [])




  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>
      <Container>

        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={5} mb={5}>
          <Typography variant="h4" gutterBottom>
            Courses
          </Typography>
        </Stack>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
          {courses.length ? 
            courses.map((element, index) => (
              <CoursesCard element={element} key={index} mainPage={false} />
            ))
          :
          <SkeletonCopm />}
        </div>
      </Container>
    </>
  );
};

export default TeacherDetails;
