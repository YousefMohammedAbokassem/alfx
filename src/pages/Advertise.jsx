import { Button, Container, Stack, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import Iconify from 'src/components/iconify';
import SkeletonCopm from 'src/components/skeleton-comp';
import AddAds from 'src/sections/ads/AddAds';
import AdsCard from 'src/sections/ads/AdsCard';
import DeleteAds from 'src/sections/ads/DeleteAds';
import UpdateAds from 'src/sections/ads/UpdateAds';
import { headerApi } from 'src/utils/headerApi';

const Advertise = () => {
  const { token } = useSelector((state) => state.auth);

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/ads`, {
        headers: headerApi(token),
      })
      .then((res) => {
        console.log(res);
        setData(res.data.ads);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const [openAdd, setOpenAdd] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const [selectedElement, setSelectedElement] = useState(null);

  const [openUpdate, setOpenUpdate] = useState(false);

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Advertise
          </Typography>
          <Button onClick={() => setOpenAdd(true)} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Advertise
          </Button>
        </Stack>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
          {loading ? (
            <SkeletonCopm />
          ) : (
            data.map((element, index) => (
              <AdsCard
                key={index}
                element={element}
                setOpenDelete={setOpenDelete}
                setSelectedElement={setSelectedElement}
                setOpenUpdate={setOpenUpdate}
              />
            ))
          )}
        </div>
      </Container>
      <AddAds open={openAdd} setOpen={setOpenAdd} setData={setData} />
      <DeleteAds
        open={openDelete}
        handleClose={handleCloseDelete}
        selectedElement={selectedElement}
        setData={setData}
      />
      <UpdateAds
        open={openUpdate}
        handleClose={handleCloseUpdate}
        setData={setData}
        selectedElement={selectedElement}
      />
    </>
  );
};

export default Advertise;
