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
import CategoryTableRow from 'src/sections/@dashboard/recommendation/CategoryTableRow';
import { logoutUser } from 'src/store/authSlice';
import { headerApi } from 'src/utils/headerApi';
import UpdateCategory from 'src/sections/@dashboard/aboutus/UpdateCategory';
import SkeletonCopm from 'src/components/skeleton-comp';

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

export default function Category() {
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

  const handleOpenMenu = (event, category, id) => {
    event.stopPropagation();
    setSelectedList(id);
    setSelectedCategory(category);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  //handle update

  // mu update
  const { token } = useSelector((state) => state.auth);

  const [categories, setCategories] = useState([]);

  const [loadingData, setLoadingData] = useState(false);

  const [OpenAdd, setOpenAdd] = useState(false);

  //handle delete admin
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [selectedList, setSelectedList] = useState('');
  console.log(categories);
  const fetchData = () => {
    setLoadingData(true);
    axios
      // .get(`${process.env.REACT_APP_API_URL}admin/categories`, {
      .get(`${process.env.REACT_APP_API_URL}admin/about_us/show`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setCategories(res.data.data);
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

  const [selectedCategory, setSelectedCategory] = useState({});

  const handleUpdate = (id, category) => {
    setOpenUpdate(true);
    setSelectedList(id);
    setSelectedCategory(category);
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
                  <SkeletonCopm />
                ) : (
                  <Card sx={{ maxWidth: 345 }}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        <strong>Name:</strong> {categories.name}
                      </Typography>
                      <Typography variant="body2" color="text.main" sx={{ fontSize: '1.2rem' }}>
                        <strong>Description:</strong> {categories.description}
                      </Typography>
                      <Typography variant="body2" color="text.main" sx={{ fontSize: '1.2rem' }}>
                        <strong>Attribute1:</strong> {categories.attribute1}
                      </Typography>
                      <Typography variant="body2" color="text.main" sx={{ fontSize: '1.2rem' }}>
                        <strong>Attribute2:</strong> {categories.attribute2}
                      </Typography>
                      <Typography variant="body2" color="text.main" sx={{ fontSize: '1.2rem' }}>
                        <strong>Attribute3:</strong> {categories.attribute3}
                      </Typography>
                      <Typography variant="body2" color="text.main" sx={{ fontSize: '1.2rem' }}>
                        <strong>Attribute4:</strong> {categories.attribute4}
                      </Typography>
                      <Typography variant="body2" color="text.main" sx={{ fontSize: '1.2rem' }}>
                        <strong>Count:</strong> {categories.count}
                      </Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'start', mb: 2, p: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdate(categories.id, categories)}
                      >
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

      <UpdateCategory
        element={selectedCategory}
        open={openUpdate}
        setOpen={setOpenUpdate}
        setCategories={setCategories}
        categories={categories}
        handleCloseMenu={handleCloseMenu}
        // idCategory={searchParams.get('id')}
        id={selectedList}
      />
    </>
  );
}
