import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import USERLIST from '../_mock/user';
import {
  Button,
  Card,
  Container,
  Stack,
  TableContainer,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  TablePagination,
  Popover,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { UserListHead } from 'src/sections/@dashboard/user';
import SkeletonTabel from 'src/components/SkeletonTabel';
import { useNavigate } from 'react-router-dom';
import AddChapter from 'src/sections/@dashboard/chapter/AddChapter';
import UpdateChapter from 'src/sections/@dashboard/chapter/UpdateChapter';
import QrComp from 'src/sections/@dashboard/qrCode/QrComp';
import AddQr from 'src/sections/@dashboard/qrCode/AddQr';
import { headerApi } from 'src/utils/headerApi';
import { logoutUser } from 'src/store/authSlice';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'lectures_count', label: 'Lectures Count', alignRight: false },
  { id: 'is_free', label: 'Is Free', alignRight: false },
  { id: 'order', label: 'Order', alignRight: false },
  { id: '' },
];

const Chapters = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();
  let [searchParams, setSearchParams] = useSearchParams();
  const [loadingData, setLoadingData] = useState(false);

  const [chapters, setChapters] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenMenu = (event, id, element) => {
    event.stopPropagation();
    setSelectedList(id);
    setSelectedElement(element);
    setAnchorEl(event.currentTarget);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  //   handle delete chapter
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedList, setSelectedList] = useState('');

  const handleDelete = () => {
    setDeleteLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/courses/chapters/delete/${selectedList}`, {
        headers: headerApi(token),
      })
      .then((res) => {
        handleCloseMenu();
        setDeleteLoading(false);
        setChapters((prev) => prev.filter((el) => el.id !== selectedList));
      })
      .catch((error) => {
        setDeleteLoading(false);
        console.log(error);
      });
  };

  //   handle popover
  const [anchorEl, setAnchorEl] = useState(null);

  // handle open add courses

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const [selectedId, setSelectedId] = useState('');

  // handle update chapter

  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedElement, setSelectedElement] = useState({});

  //start  handle qr
  useEffect(() => {
    setLoadingData(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/courses/${id}`, {
        headers: headerApi(token),
      })
      .then((res) => {
        console.log(res);

        setChapters(res.data.chapters);
        setLoadingData(false);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 401) {
          dispatch(logoutUser());
        }
        setLoadingData(false);
      });
  }, [token, id]);

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Chapter : {searchParams.get('name')}
          </Typography>
          <Button onClick={() => setOpenAdd(true)} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Chapter
          </Button>
        </Stack>
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {loadingData ? (
                    <SkeletonTabel number={3} />
                  ) : (
                    chapters.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((element, index) => (
                      <TableRow
                        key={index}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/dashboard/courses/lectures/${element.id}`)}
                      >
                        <TableCell align="left">{element.name}</TableCell>
                        <TableCell align="left">{element.lectures_count}</TableCell>
                        <TableCell align="left">{element.is_free === 1 ? 'Yes' : 'No'}</TableCell>
                        <TableCell align="left">{element.order}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(event) => handleOpenMenu(event, element.id, element)}
                          >
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
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
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem aria-describedby={id} onClick={() => setOpenUpdate(true)}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Update Chapter
        </MenuItem>
        <MenuItem sx={{ color: 'error.main' }} onClick={handleDelete}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          {deleteLoading ? <CircularProgress size={20} /> : 'Delete'}
        </MenuItem>
      </Popover>
      <AddChapter open={openAdd} setOpen={setOpenAdd} setData={setChapters} handleCloseMenu={handleCloseMenu} />
      <UpdateChapter
        handleCloseMenu={handleCloseMenu}
        setData={setChapters}
        element={selectedElement}
        open={openUpdate}
        setOpen={setOpenUpdate}
        chapterId={selectedList}
      />
    </>
  );
};

export default Chapters;
