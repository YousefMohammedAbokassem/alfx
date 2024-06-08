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
} from '@mui/material';
// components
import { useTheme } from '@mui/material/styles';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import SkeletonTabel from 'src/components/SkeletonTabel';
import AddRecommendation from 'src/sections/@dashboard/recommendation/AddRecommendation';
import RecommendationTableRow from 'src/sections/@dashboard/recommendation/RecommendationTableRow';
import UpdateRecommendation from 'src/sections/@dashboard/recommendation/UpdateRecommendation';
import { logoutUser } from 'src/store/authSlice';
import { headerApi } from 'src/utils/headerApi';
import SkeletonComp from 'src/components/skeleton-comp';

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

export default function Recommendation() {
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

  const handleOpenMenu = (event, recommendation, id) => {
    event.stopPropagation();
    setSelectedList(id);
    setSelectedRecommendation(recommendation);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  //handle update

  // mu update
  const { token } = useSelector((state) => state.auth);

  const [recommendations, setRecommendations] = useState([]);

  const [loadingData, setLoadingData] = useState(false);

  const [OpenAdd, setOpenAdd] = useState(false);

  //handle delete admin
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [selectedList, setSelectedList] = useState('');
  const handleDeleteAdmin = (id) => {
    setDeleteLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/recommendation/delete/${id}`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setDeleteLoading(false);
        setRecommendations((prev) => prev.filter((el) => el.id !== id));
        handleCloseMenu();
        console.log(res);
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
      .get(`${process.env.REACT_APP_API_URL}admin/recommendation/index/${searchParams.get('id')}`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setRecommendations(res.data.data);
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

  const [selectedRecommendation, setSelectedRecommendation] = useState({});

  const handleUpdate = (id, recommendation) => {
    setOpenUpdate(true);
    setSelectedList(id);
    setSelectedRecommendation(recommendation);
  };
  const [searchParams] = useSearchParams();
  console.log(searchParams.get('id'));
  const theme = useTheme();
  return (
    <>
      <Helmet>
        <title> Recommendations </title>
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
                fontSize: '14px',
              },
            }}
          >
            Recommendations
          </Typography>
          <Button
            onClick={() => setOpenAdd(true)}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            color={'primary'}
            sx={{
              color: '#fff',
              [theme.breakpoints.up('sm')]: {
                fontSize: '16px',
              },
              [theme.breakpoints.up('xs')]: {
                fontSize: '12px',
              },
            }}
          >
            new Recommendation
          </Button>
        </Stack>

        <>
          <>
            <>
              <>
                <div
                  style={{
                    display: 'flex',
                    // gridTemplateColumns: 'repeat(auto-fill,minmax(450px,1fr))',
                    justifyContent: 'start',
                    alignItems: 'center',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: '30px',
                    flexWrap: 'wrap',
                  }}
                >
                  {loadingData ? (
                    <SkeletonComp />
                  ) : (
                    recommendations.map((recommendation, index) => {
                      return (
                        <RecommendationTableRow
                          recommendation={recommendation}
                          loading={deleteLoading}
                          key={index}
                          id={searchParams.get('id')}
                          handleDeleteAdmin={handleDeleteAdmin}
                          handleUpdate={handleUpdate}
                          setSelectedRecommendation={setSelectedRecommendation}
                        />
                      );
                    })
                  )}
                </div>
              </>
            </>
          </>
        </>
      </Container>

      <AddRecommendation
        open={OpenAdd}
        id={searchParams.get('id')}
        setOpen={setOpenAdd}
        setData={setRecommendations}
        handleCloseMenu={handleCloseMenu}
      />
      <UpdateRecommendation
        element={selectedRecommendation}
        open={openUpdate}
        setOpen={setOpenUpdate}
        setRecommendations={setRecommendations}
        recommendations={recommendations}
        handleCloseMenu={handleCloseMenu}
        idCategory={searchParams.get('id')}
        id={selectedList}
        fetchData={fetchData}
      />
    </>
  );
}
