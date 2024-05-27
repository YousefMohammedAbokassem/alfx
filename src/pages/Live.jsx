import {
  Button,
  Card,
  Container,
  MenuItem,
  Popover,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import SkeletonTable from 'src/components/SkeletonTabel';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { UserListHead } from 'src/sections/@dashboard/user';
import LiveTableRow from 'src/sections/live/LiveTableRow';
import { headerApi } from 'src/utils/headerApi';
import USERLIST from '../_mock/user';
import AddLive from 'src/sections/live/AddLive';
import DeleteLive from 'src/sections/live/DeleteLive';
import UpdateLive from 'src/sections/live/UpdateLive';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'is_locked', label: 'Locked', alignRight: false },
  { id: 'teacher_name', label: 'Teacher', alignRight: false },
  { id: 'teacher_specialization', label: 'Teacher Specialization', alignRight: false },
  { id: 'url', label: 'Url', alignRight: false },
  { id: '' },
];

const Live = () => {
  const { token } = useSelector((state) => state.auth);

  const [openAdd, setOpenAdd] = useState(false);

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const [selectedLive, setSelectedLive] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const handleOpenMenu = (event, live, id) => {
    setSelectedLive(live);
    setSelectedId(id);
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/broadcasts`, {
        headers: headerApi(token),
      })
      .then((res) => {
        console.log(res);
        setData(res.data.broadcasts);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [token]);

  //   handle update and delete

  const [openUpdate, setOpenUpdate] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  // get teacher to use in update and add component

  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/teachers`, {
        headers: headerApi(token),
      })
      .then((res) => {
        console.log(res);
        setTeachers(res.data.teachers);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Live
          </Typography>
          <Button onClick={() => setOpenAdd(true)} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Live
          </Button>
        </Stack>
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {loading ? (
                    <SkeletonTable number={5} />
                  ) : (
                    data
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((element, index) => (
                        <LiveTableRow key={index} element={element} handleOpenMenu={handleOpenMenu} />
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
        <MenuItem onClick={() => setOpenUpdate(true)}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Update Info
        </MenuItem>
        <MenuItem sx={{ color: 'error.main' }} onClick={() => setOpenDelete(true)}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <AddLive
        open={openAdd}
        setOpen={setOpenAdd}
        teachers={teachers}
        setData={setData}
        handleCloseMenu={handleCloseMenu}
      />
      <UpdateLive
        open={openUpdate}
        setOpen={setOpenUpdate}
        setData={setData}
        id={selectedId}
        element={selectedLive}
        handleCloseMenu={handleCloseMenu}
        teachers={teachers}
      />
      <DeleteLive
        open={openDelete}
        handleClose={handleCloseDelete}
        setData={setData}
        handleCloseMenu={handleCloseMenu}
        id={selectedId}
      />
    </>
  );
};

export default Live;
