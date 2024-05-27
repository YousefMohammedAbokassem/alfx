import { Button, Container, Stack, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import Iconify from 'src/components/iconify';
import SkeletonCopm from 'src/components/skeleton-comp';
import AddPos from 'src/sections/@dashboard/pos/AddPos';
import DeletePos from 'src/sections/@dashboard/pos/DeletePos';
import PosCard from 'src/sections/@dashboard/pos/PosCard';
import UpdatePos from 'src/sections/@dashboard/pos/UpdatePos';
import { headerApi } from 'src/utils/headerApi';

const Pos = () => {
  const { token } = useSelector((state) => state.auth);

  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setOpenAdd(false);
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/pos`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setLoading(false);
        console.log(res);
        setPos(res.data.pos);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [token]);

  //handle Add
  const [openAdd, setOpenAdd] = useState(false);

  //handle close pos
  const [openDelete, setOpenDelete] = useState(false);

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const [selectedDelete, setSelectedDelete] = useState('');

  //handle update
  const [openUpdate, setOpenUpdate] = useState(false);

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const [selectedUpdate, setSelectedUpdate] = useState({});

  const handleUpdateSuccess = (updatedElement) => {
    const updatedElements = pos.map((el) => {
      if (el.id === updatedElement.id) {
        return updatedElement;
      }
      return el;
    });
  
    setPos(updatedElements);
  };

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Pos
          </Typography>
          <Button onClick={() => setOpenAdd(true)} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Pos
          </Button>
        </Stack>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
          {loading ? (
            <SkeletonCopm />
          ) : (
            pos.map((element, index) => (
              <PosCard setOpenDelete={setOpenDelete} setDelete={setSelectedDelete} key={index} element={element} setSelectedUpdate={setSelectedUpdate} setOpenUpdate={setOpenUpdate} />
            ))
          )}
        </div>
      </Container>
      <AddPos open={openAdd} setData={setPos} handleClose={handleClose} />
      <DeletePos open={openDelete} handleClose={handleCloseDelete} id={selectedDelete} setData={setPos} />
      <UpdatePos onUpdateSuccess={handleUpdateSuccess} open={openUpdate} handleClose={handleCloseUpdate} element={selectedUpdate} />
    </>
  );
};

export default Pos;
