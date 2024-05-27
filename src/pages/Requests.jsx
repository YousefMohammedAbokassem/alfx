import {
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
import Scrollbar from 'src/components/scrollbar';
import { UserListHead } from 'src/sections/@dashboard/user';
import RequestTableRow from 'src/sections/request/RequestTableRow';
import { headerApi } from 'src/utils/headerApi';
import USERLIST from '../_mock/user';
import Iconify from 'src/components/iconify';
import DeleteRequest from 'src/sections/request/DeleteRequest';

const TABLE_HEAD = [
  { id: 'user', label: 'User', alignRight: false },
  { id: 'teacher', label: 'Teacher', alignRight: false },
  { id: 'teacher_phone', label: 'Teacher Phone', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: '' },
];

const Requests = () => {
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/broadcasts/get_meet_orders`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  console.log(data);

  // handle table
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const [selectedId, setSelectedId] = useState('');

  const handleOpenMenu = (event, id) => {
    setSelectedId(id);
    setAnchorEl(event.currentTarget);
  };

  //handle delete

  const [openDelete, setOpenDelete] = useState(false);

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Meet orders
          </Typography>
        </Stack>
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {loading ? (
                    <SkeletonTable number={3} />
                  ) : (
                    data
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((element, index) => (
                        <RequestTableRow key={index} element={element} handleOpenMenu={handleOpenMenu} />
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
        <MenuItem sx={{ color: 'error.main' }} onClick={() => setOpenDelete(true)}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <DeleteRequest
        open={openDelete}
        handleClose={handleCloseDelete}
        setData={setData}
        handleCloseMenu={handleCloseMenu}
        id={selectedId}
      />
    </>
  );
};

export default Requests;
