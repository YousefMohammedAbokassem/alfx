import { Button, Container, Pagination, Stack, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Iconify from 'src/components/iconify';
import SkeletonCopm from 'src/components/skeleton-comp';
import { useDispatch, useSelector } from 'react-redux';
import AddCourses from 'src/sections/courses/AddCourses';
import DeleteCourse from 'src/sections/courses/DeleteCourse';
import UpdateCourse from 'src/sections/courses/UpdateCourse';
import CoursesCard from 'src/sections/courses/CoursesCard';
import { headerApi } from 'src/utils/headerApi';
import { logoutUser } from 'src/store/authSlice';

const Courses = () => {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth);
  const [openAdd, setOpenAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);

  // handle delete dialog
  const [openDelete, setOpenDelete] = useState(false);

  const handleClose = () => {
    setOpenDelete(false);
  };

  const [selectedDelete, setSelectedDelete] = useState(null);

  const handleDelete = (id) => {
    setOpenDelete(true);
    setSelectedDelete(id);
  };

  // handle update dialog
  const [openUpdate, setOpenUpdate] = useState(false);

  const [selectedUpdate, setSelectedUpdate] = useState({})

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleUpdate = (element) => {
    setOpenUpdate(true);
    setSelectedUpdate(element)
  };


  const handleUpdateSuccess = (updatedElement) => {
    const updatedElements = courses.map((el) => {
      if (el.id === updatedElement.id) {
        return updatedElement;
      }
      return el;
    });
  
    setCourses(updatedElements);
  };

  //handle pagination
  const [pagesCount, setPagesCount] = useState(1);

  const [page, setPage] = useState(() => {
    const savedPage = localStorage.getItem('currentPage');
    return savedPage ? parseInt(savedPage) : 1;
  });

  useEffect(() => {
    localStorage.setItem('currentPage', page.toString());
  }, [page]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/courses?page=${page}`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setLoading(false);
        setCourses(res.data.courses);
        setPagesCount(res.data.pagesCount);
      })
      .catch((error) => {
        console.log(error);
        if(error.response.status === 401){
          dispatch(logoutUser())
        }
        setLoading(false);
      });
  }, [page, token]);

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Courses
          </Typography>
          <Button onClick={() => setOpenAdd(true)} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Course
          </Button>
        </Stack>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
          {loading ? (
            <SkeletonCopm />
          ) : (
            courses.map((element, index) => (
              <CoursesCard
                mainPage={true}
                element={element}
                key={index}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
              />
            ))
          )}
        </div>
        <Stack sx={{ marginTop: '50px', justifyContent: 'center', alignItems: 'center' }} spacing={2}>
          <Pagination page={page} onChange={(e, value) => setPage(value)} count={pagesCount} variant="outlined" shape="rounded" />
        </Stack>
      </Container>
      <AddCourses open={openAdd} setOpen={setOpenAdd} setData={setCourses} />
      <DeleteCourse open={openDelete} handleClose={handleClose} id={selectedDelete} setData={setCourses} />
      <UpdateCourse onUpdateSuccess={handleUpdateSuccess} element={selectedUpdate} open={openUpdate} handleClose={handleCloseUpdate} />
    </>
  );
};

export default Courses;
