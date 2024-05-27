import { Button, Container, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import AddMcq from './AddMcq';
import UpdateMcq from './UpdateMcq';
import DeleteMcq from './DeleteMcq';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';
import McqComp from './McqComp';
import SkeletonCopm from 'src/components/skeleton-comp';

const McqQuestion = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false)

  const [mcq, setMcq] = useState([]);

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/mcq/lecture/${id}`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setMcq(res.data.mcq);
        setLoading(false)
      })
      .catch((error) => {
        console.log(error);
        setLoading(false)
      });
  }, [token, id]);

  const [openAdd, setOpenAdd] = useState(false);

  //handle update

  const [openUpdate, setOpenUpdate] = useState(false);

  const [selectedUpdate, setSelectedUpdate] = useState({});

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  //handle delete
  const [openDelete, setOpenDelete] = useState(false);

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const [selectedDelete, setSelectedDelete] = useState('');

  return (
    <>
      <Container sx={{ mt: 6 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Mcq
          </Typography>
          <Button onClick={() => setOpenAdd(true)} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Mcq
          </Button>
        </Stack>
        {loading ? <SkeletonCopm /> :  mcq.map((element, index) => (
          <McqComp
            key={index}
            index={index}
            element={element}
            setSelectedDelete={setSelectedDelete}
            setOpenDelete={setOpenDelete}
            setOpenUpdate={setOpenUpdate}
            setSelectedUpdate={setSelectedUpdate}
          />
        ))}
      </Container>
      <AddMcq open={openAdd} setOpen={setOpenAdd} setData={setMcq} setLoadingData={setLoading} />
      <UpdateMcq open={openUpdate} handleClose={handleCloseUpdate} setData={setMcq} element={selectedUpdate} />
      <DeleteMcq open={openDelete} handleClose={handleCloseDelete} setData={setMcq} id={selectedDelete} />
    </>
  );
};

export default McqQuestion;
