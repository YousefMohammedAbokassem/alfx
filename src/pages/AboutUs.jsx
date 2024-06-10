import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Popover,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  CircularProgress,
  CardContent,
  Box,
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import SkeletonTabel from 'src/components/SkeletonTabel';
import { logoutUser } from 'src/store/authSlice';
import { headerApi } from 'src/utils/headerApi';
import UpdateAboutUs from 'src/sections/@dashboard/aboutus/UpdateAboutUs';
import SkeletonComp from 'src/components/skeleton-comp';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function AboutUs() {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedStatus, setSelectedStatus] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event, aboutUs, id) => {
    event.stopPropagation();
    setSelectedList(id);
    setSelectedAboutUs(aboutUs);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  //handle update

  // mu update
  const { token } = useSelector((state) => state.auth);

  const [aboutUs, setAboutUs] = useState([]);

  const [loadingData, setLoadingData] = useState(false);

  const [OpenAdd, setOpenAdd] = useState(false);

  //handle delete admin
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [selectedList, setSelectedList] = useState('');
  console.log(aboutUs);
  const fetchData = () => {
    setLoadingData(true);
    axios
      // .get(`${process.env.REACT_APP_API_URL}admin/categories`, {
      .get(`${process.env.REACT_APP_API_URL}admin/about_us/show`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setAboutUs(res.data.data);
        setLoadingData(false);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          dispatch(logoutUser());
        }
        setLoadingData(false);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  // handle update
  const [openUpdate, setOpenUpdate] = useState(false);

  const [selectedAboutUs, setSelectedAboutUs] = useState({});

  const handleUpdate = (id, aboutUs) => {
    setOpenUpdate(true);
    setSelectedList(id);
    setSelectedAboutUs(aboutUs);
  };
  const [searchParams] = useSearchParams();
  console.log(searchParams.get('id'));
  return (
    <>
      <Helmet>
        <title> AboutUs </title>
      </Helmet>

      <Container>
        <>
          <>
            <>
              <>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                  <Typography variant="h4" gutterBottom>
                    AboutUs
                  </Typography>
                </Stack>
                {loadingData ? (
                  <SkeletonComp />
                ) : (
                  <Card sx={{ width: '100%' }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'end', flexDirection: 'column' }}>
                      <Typography
                        sx={{ display: 'flex', justifyContent: 'end' }}
                        gutterBottom
                        variant="h5"
                        component="div"
                      >
                        {aboutUs.name}
                        <strong> : الاسم</strong>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.main"
                        sx={{ fontSize: '0.9rem', display: 'flex', justifyContent: 'end' }}
                      >
                        {aboutUs.description}
                        <strong> : الوصف</strong>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.main"
                        sx={{ fontSize: '0.9rem', display: 'flex', justifyContent: 'end' }}
                      >
                        {aboutUs.attribute1}
                        <strong> : منشئ الؤسسة</strong>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.main"
                        sx={{ fontSize: '0.9rem', display: 'flex', justifyContent: 'end' }}
                      >
                        {aboutUs.attribute2}
                        <strong> : الخبرة</strong>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.main"
                        sx={{ fontSize: '0.9rem', display: 'flex', justifyContent: 'end' }}
                      >
                        {aboutUs.attribute3}
                        <strong> : أفضل مدرب</strong>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.main"
                        sx={{ fontSize: '0.9rem', display: 'flex', justifyContent: 'end' }}
                      >
                        {aboutUs.attribute4}
                        <strong> : العنوان</strong>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.main"
                        sx={{ fontSize: '0.9rem', display: 'flex', justifyContent: 'end' }}
                      >
                        {aboutUs.count}
                        <strong> : العدد</strong>
                      </Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'end', mb: 2, p: 2 }}>
                      <Button variant="contained" color="primary" onClick={() => handleUpdate(aboutUs.id, aboutUs)}>
                        Update
                      </Button>
                    </Box>
                  </Card>
                )}
              </>
            </>
          </>
        </>
      </Container>

      <UpdateAboutUs
        element={selectedAboutUs}
        open={openUpdate}
        setOpen={setOpenUpdate}
        setAboutUs={setAboutUs}
        aboutUs={aboutUs}
        handleCloseMenu={handleCloseMenu}
        // idAboutUs={searchParams.get('id')}
        id={selectedList}
      />
    </>
  );
}
