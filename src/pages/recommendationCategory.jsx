import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
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
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import { useTheme } from '@mui/material/styles';

import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import SkeletonTabel from 'src/components/SkeletonTabel';
import AddRecommendationCategory from 'src/sections/@dashboard/recommendationCategory/AddRecommendationCategory';
import RecommendationCategoryTableRow from 'src/sections/@dashboard/recommendationCategory/RecommendationCategoryTableRow';
import { logoutUser } from 'src/store/authSlice';
import { headerApi } from 'src/utils/headerApi';
import UpdateRecommendationCategory from 'src/sections/@dashboard/recommendationCategory/UpdateRecommendationCategory';

// ----------------------------------------------------------------------

const TABLE_HEAD = [{ id: 'name', label: 'Name', alignRight: false }, { id: '' }];

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

export default function RecommendationCategory() {
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

  const handleOpenMenu = (event, recommendationCategory, id) => {
    event.stopPropagation();
    setSelectedList(id);
    setSelectedRecommendationCategory(recommendationCategory);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  //handle update

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  // mu update
  const { token } = useSelector((state) => state.auth);

  const [recommendationCategories, setRecommendationCategories] = useState([]);

  const [loadingData, setLoadingData] = useState(false);

  const [OpenAdd, setOpenAdd] = useState(false);

  //handle delete admin
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [selectedList, setSelectedList] = useState('');
  const handleDeleteAdmin = () => {
    setDeleteLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/recommendation-category/delete/${selectedList}`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setDeleteLoading(false);
        setRecommendationCategories((prev) => prev.filter((el) => el.id !== selectedList));
        handleCloseMenu();
      })
      .catch((error) => {
        setDeleteLoading(false);
        if (error.response.status === 401) {
          dispatch(logoutUser());
        }
      });
  };
  const fetchData = () => {
    setLoadingData(true);
    axios
      // .get(`${process.env.REACT_APP_API_URL}admin/categories`, {
      .get(`${process.env.REACT_APP_API_URL}admin/recommendation-category/index`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setRecommendationCategories(res.data.data);
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

  const [selectedRecommendationCategory, setSelectedRecommendationCategory] = useState({});

  const handleUpdate = () => {
    setOpenUpdate(true);
  };
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> Recommendation Categories </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography
            variant="h4"
            gutterBottom
            color={'primary.main'}
            sx={{
              [theme.breakpoints.up('sm')]: {
                fontSize: '18px',
              },
              [theme.breakpoints.up('xs')]: {
                fontSize: '12px',
              },
            }}
          >
            Recommendation Categories
          </Typography>
          <Button
            onClick={() => setOpenAdd(true)}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            color={'primary'}
            sx={{
              color: '#fff',
              [theme.breakpoints.up('sm')]: {
                fontSize: '18px',
              },
              [theme.breakpoints.up('xs')]: {
                fontSize: '12px',
              },
            }}
          >
            New Recommendation Category
          </Button>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={recommendationCategories.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {loadingData ? (
                    <SkeletonTabel number={4} />
                  ) : (
                    recommendationCategories
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((category, index) => {
                        return (
                          <RecommendationCategoryTableRow
                            mainPage={true}
                            category={category}
                            key={index}
                            handleOpenMenu={handleOpenMenu}
                          />
                        );
                      })
                  )}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={recommendationCategories.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 'auto',
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={handleUpdate}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Update Info
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={handleDeleteAdmin}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          {deleteLoading ? <CircularProgress size={20} /> : 'Delete'}
        </MenuItem>
      </Popover>
      <AddRecommendationCategory
        open={OpenAdd}
        setOpen={setOpenAdd}
        setData={setRecommendationCategories}
        handleCloseMenu={handleCloseMenu}
      />
      <UpdateRecommendationCategory
        element={selectedRecommendationCategory}
        open={openUpdate}
        setOpen={setOpenUpdate}
        setCategories={setRecommendationCategories}
        categories={recommendationCategories}
        handleCloseMenu={handleCloseMenu}
      />
    </>
  );
}
