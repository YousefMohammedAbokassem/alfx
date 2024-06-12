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
  Pagination,
  Select,
  FormControl,
  InputLabel,
  MenuItem as SelectMenuItem,
  Checkbox,
  ListItemText,
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
import AddGlobalSetting from 'src/sections/@dashboard/qrCode/AddQr';
import QrTableRow from 'src/sections/@dashboard/globalsetting/QrTableRow';
import UpdateGlobalSetting from 'src/sections/@dashboard/globalsetting/UpdateGlobalSetting';
import { logoutUser } from 'src/store/authSlice';
import { headerApi } from 'src/utils/headerApi';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'code', label: 'Code', alignRight: false },
  { id: 'pos', label: 'Pos', alignRight: false },
  { id: 'courses', label: 'Courses', alignRight: false },
  { id: '' },
];
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

function applySortFilter(array, comparator, query, filterCourses, filterPos) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  let filteredArray = stabilizedThis.map((el) => el[0]);
  if (query) {
    filteredArray = filter(filteredArray, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  if (filterCourses.length > 0) {
    filteredArray = filter(filteredArray, (_user) => filterCourses.includes(_user.courses));
  }
  if (filterPos.length > 0) {
    filteredArray = filter(filteredArray, (_user) => filterPos.includes(_user.pos));
  }
  return filteredArray;
}

export default function GlobalSetting() {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [filterCourses, setFilterCourses] = useState([]);
  const [filterCoursesData, setFilterCoursesData] = useState([]);
  const [filterPos, setFilterPos] = useState([]);
  const [filterPosesData, setFilterPosesData] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedStatus, setSelectedStatus] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event, globalSetting, id) => {
    event.stopPropagation();
    setSelectedList(id);
    setSelectedGlobalSetting(globalSetting);
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

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName, filterCourses, filterPos);

  const isNotFound = !filteredUsers.length && !!filterName;

  // mu update
  const { token } = useSelector((state) => state.auth);

  const [globalSettings, setGlobalSettings] = useState([]);

  const [loadingData, setLoadingData] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);

  //handle delete admin
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [selectedList, setSelectedList] = useState('');
  const handleDeleteAdmin = () => {
    setDeleteLoading(true);
    axios
      .delete(`${process.env.REACT_APP_API_URL}admin/settings/${selectedList}`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setDeleteLoading(false);
        setGlobalSettings((prev) => prev.filter((el) => el.id !== selectedList));
        handleCloseMenu();
        fetchData();
      })
      .catch((error) => {
        setDeleteLoading(false);
      });
  };
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    console.log('Current Page:', value);
  };
  const fetchData = () => {
    setLoadingData(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/qr_codes?page=${currentPage}`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setGlobalSettings(res.data.qr_codes);
        console.log(res.data.qr_codes);
        setLoadingData(false);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          dispatch(logoutUser());
        }
        setLoadingData(false);
      });
  };
  const fetchFilterData = () => {
    // setLoadingData(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/qr_codes/get_filter`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setFilterCoursesData(res.data.courses);
        setFilterPosesData(res.data.poses);
        // setGlobalSettings(res.data.qr_codes);
        console.log(res, 'dddddddddddddddddddddddddddddddddd');
        console.log(res.data.qr_codes);
        // setLoadingData(false);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          dispatch(logoutUser());
        }
        // setLoadingData(false);
      });
  };
  const postFilterData = () => {
    // setLoadingData(true);
    axios
      .post(`${process.env.REACT_APP_API_URL}admin/qr_codes/filter`, {
        headers: headerApi(token),
      })
      .then((res) => {
        const formData = new FormData();
        formData.append('course_ids', filterCourses);
        formData.append('pos_ids', filterPos);

        // setGlobalSettings(res.data.qr_codes);
        console.log(res, 'dddddddddddddddddddddddddddddddddd');
        console.log(res.data.qr_codes);
        // setLoadingData(false);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          dispatch(logoutUser());
        }
        // setLoadingData(false);
      });
  };
  useEffect(() => {
    fetchData();
  }, [currentPage]);
  useEffect(() => {
    fetchFilterData();
  }, []);
  // handle update
  const [openUpdate, setOpenUpdate] = useState(false);

  const [selectedGlobalSetting, setSelectedGlobalSetting] = useState({});

  const handleUpdate = () => {
    setOpenUpdate(true);
  };

  return (
    <>
      <Helmet>
        <title> Global Settings</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom color={'primary.main'}>
            Qr Code
          </Typography>
          <Button
            onClick={() => setOpenAdd(true)}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            color={'primary'}
            sx={{ color: '#fff' }}
          >
            New QrCode
          </Button>
        </Stack>

        <Stack direction="row" spacing={2} mb={5}>
          <FormControl variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel id="filter-courses-label">Courses</InputLabel>
            <Select
              labelId="filter-courses-label"
              id="filter-courses"
              multiple
              value={filterCourses}
              onChange={(e) => setFilterCourses(e.target.value)}
              renderValue={(selected) =>
                selected.map((value) => filterCoursesData.find((course) => course.id === value)?.name).join(', ')
              }
              label="Courses"
            >
              {filterCoursesData.map((course) => (
                <SelectMenuItem key={course.id} value={course.id}>
                  <Checkbox checked={filterCourses.indexOf(course.id) > -1} />
                  <ListItemText primary={course.name} />
                </SelectMenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel id="filter-pos-label">Pos</InputLabel>
            <Select
              labelId="filter-pos-label"
              id="filter-pos"
              multiple
              value={filterPos}
              onChange={(e) => setFilterPos(e.target.value)}
              renderValue={(selected) =>
                selected.map((value) => filterPosesData.find((p) => p.id === value)?.name).join(', ')
              }
              label="Pos"
            >
              {filterPosesData.map((p) => (
                <SelectMenuItem key={p.id} value={p.id}>
                  <Checkbox checked={filterPos.indexOf(p.id) > -1} />
                  <ListItemText primary={p.name} />
                </SelectMenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={globalSettings?.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {loadingData ? (
                    <SkeletonTabel number={4} />
                  ) : (
                    globalSettings?.data?.map((globalSetting, index) => {
                      return (
                        <QrTableRow
                          mainPage={true}
                          element={globalSetting}
                          key={index}
                          handleOpenMenu={handleOpenMenu}
                          page={page}
                          setPage={setPage}
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
          <Pagination count={globalSettings.last_page} color="primary" onChange={handlePageChange} page={currentPage} />
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
          Update Global Setting
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={handleDeleteAdmin}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          {deleteLoading ? <CircularProgress size={20} /> : 'Delete'}
        </MenuItem>
      </Popover>
      <AddGlobalSetting
        open={openAdd}
        setOpen={setOpenAdd}
        setData={setGlobalSettings}
        handleCloseMenu={handleCloseMenu}
        fetchAllData={fetchData}
      />
      <UpdateGlobalSetting
        element={selectedGlobalSetting}
        open={openUpdate}
        setOpen={setOpenUpdate}
        setGlobalSettings={setGlobalSettings}
        globalSettings={globalSettings}
        handleCloseMenu={handleCloseMenu}
      />
    </>
  );
}
