import { LoadingButton } from '@mui/lab';
import { Button, Card, CardActions, CardContent, Container, Stack, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Iconify from 'src/components/iconify';
import SkeletonCopm from 'src/components/skeleton-comp';
import AddLecture from 'src/sections/@dashboard/lecture/AddLecture';
import UpdateLecture from 'src/sections/@dashboard/lecture/UpdateLecture';
import { customDecrypt } from 'src/utils/hashingFunction';
import { headerApi } from 'src/utils/headerApi';
import { logoutUser } from 'src/store/authSlice';
import { Document, Page } from 'react-pdf';

const Lectures = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  // add logic
  const [openAdd, setOpenAdd] = useState(false);
  const handleClose = () => {
    setOpenAdd(false);
  };

  //update logic

  const [openUpdate, setOpenUpdate] = useState(false);

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  //deleteLogic
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = (id) => {
    setDeleteLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/courses/lectures/delete/${id}`, {
        headers: headerApi(token),
      })
      .then((res) => {
        console.log(res);
        setDeleteLoading(false);
        setLectures((prev) => prev.filter((el) => el.id !== id));
      })
      .catch((error) => {
        console.log(error);
        setDeleteLoading(false);
      });
  };

  //update logic
  const [selectedId, setSelectedId] = useState('');
  const [selectedElement, setSelectedElement] = useState({});

  const handleUpdate = (event, id, element) => {
    setOpenUpdate(true);
    setSelectedElement(element);
    setSelectedId(id);
  };

  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/courses/chapters/${id}`, {
        headers: headerApi(token),
      })
      .then((res) => {
        console.log(res);
        setLectures(res.data.lectures);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 401) {
          dispatch(logoutUser());
        }
        setLoading(false);
      });
  }, [token, id]);

  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Lectures
          </Typography>
          <Button onClick={() => setOpenAdd(true)} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Lectures
          </Button>
        </Stack>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
          {loading ? (
            <SkeletonCopm />
          ) : (
            lectures.map((element, index) => (
              <Card key={index} sx={{ maxWidth: 345 }}>
                <iframe
                  width="350"
                  height="315"
                  src={`https://www.youtube.com/embed/${customDecrypt(element.video)}?si=7erLKeQtKJ0cHYn3`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {element.name}
                  </Typography>
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      {element.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Duration: {element.duration} min
                    </Typography>
                  </Stack>
                  {element.file && element.file.url && (
                    <a href={`${process.env.REACT_APP_API_URL_IMAGE}${element.file.url}`} download target="_blank">
                      Download file
                    </a>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', display: 'flex' }}>
                  <Stack>
                    <Button size="small" onClick={() => navigate(`/dashboard/courses/lectures/mcq/${element.id}`)}>
                      Details
                    </Button>
                  </Stack>
                  <Stack direction="row">
                    <Button size="small" onClick={(event) => handleUpdate(event, element.id, element)}>
                      Update
                    </Button>
                    <LoadingButton loading={deleteLoading} size="small" onClick={() => handleDelete(element.id)}>
                      Delete
                    </LoadingButton>
                  </Stack>
                </CardActions>
              </Card>
            ))
          )}
        </div>
      </Container>
      <AddLecture open={openAdd} handleClose={handleClose} setData={setLectures} />
      <UpdateLecture
        selectedId={selectedId}
        element={selectedElement}
        setData={setLectures}
        open={openUpdate}
        handleClose={handleCloseUpdate}
      />
    </>
  );
};

export default Lectures;
