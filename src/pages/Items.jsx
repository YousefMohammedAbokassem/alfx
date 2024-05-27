import { Button, Container, Stack, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import Iconify from 'src/components/iconify';
import AddCity from 'src/sections/@dashboard/cities/AddCity';
import UpdateCity from 'src/sections/@dashboard/cities/UpdateCity';
import ItemsComp from 'src/sections/@dashboard/items/ItemsComp';
import AddTopics from 'src/sections/@dashboard/topics/AddTopics';
import TopicsComp from 'src/sections/@dashboard/topics/TopicsComp';
import { headerApi } from 'src/utils/headerApi';
import { logoutUser } from 'src/store/authSlice';
const Items = () => {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth);

  //hnadle city
  const [loadingCity, setLoadingCity] = useState(false);
  const [city, setCity] = useState([]);

  const [openAddCity, setOpenAddCity] = useState(false);

  const [selectedId, setSelectedId] = useState('');
  const [selectedElement, setSelectedElement] = useState({});

  //handle update city
  const [openUpdate, setOpenUpdate] = useState(false);


    // start topics logic
    const [addTopics, setAddTopics] = useState(false);


  
    const [selectedTopics, setSelecedTopics] = useState({});
  
    const [topics, setTopics] = useState([]);
  
    const [topicsLoading, setTopicsLoading] = useState(false);
  
    useEffect(() => {
      axios
        .get(`${process.env.REACT_APP_API_URL}admin/topics`, {
          headers: headerApi(token)
        })
        .then((res) => {
          console.log(res);
          setTopics(res.data.topics);
        })
        .catch((error) => {
          console.log(error);
          if(error.response.status === 401){
            dispatch(logoutUser())
          }
        });
    }, []);

  useEffect(() => {
    setLoadingCity(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/cities`, {
        headers: headerApi(token),
      })
      .then((res) => {
        console.log(res);
        setCity(res.data.cities);
        setLoadingCity(false);
      })
      .catch((error) => {
        console.log(error);
        setLoadingCity(false);
      });
  }, [token]);

  // handle poponver 
  const [anchorEl, setAnchorEl] = useState(null);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };


  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>
      <Container>
        {/* start city */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Cities
          </Typography>
          <Button onClick={() => setOpenAddCity(true)} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New City
          </Button>
        </Stack>
        <ItemsComp
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          setOpenUpdate={setOpenUpdate}
          setSelectedElement={setSelectedElement}
          loadingCity={loadingCity}
          city={city}
          setCity={setCity}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
        />
      </Container>
      <AddCity open={openAddCity} setOpen={setOpenAddCity} setData={setCity} />
      <UpdateCity
        open={openUpdate}
        setOpen={setOpenUpdate}
        element={selectedElement}
        selectedId={selectedId}
        setData={setCity}
        handleCloseMenu={handleCloseMenu}
      />
      {/* end city */}

      <Container sx={{ mt: 6 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Topics
          </Typography>
          <Button onClick={() => setAddTopics(true)} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Topics
          </Button>
        </Stack>
      </Container>
      <TopicsComp
        topicsLoading={topicsLoading}
        topics={topics}
        setTopics={setTopics}
        selectedTopics={selectedTopics}
        setSelecedTopics={setSelecedTopics}
      />
      <AddTopics open={addTopics} setOpen={setAddTopics} setData={setTopics} />

      {/* end topics */}

      {/* end topics */}
    </>
  );
};

export default Items;
