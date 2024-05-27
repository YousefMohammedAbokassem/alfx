import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Button,
  Popover,
  MenuItem,
  TableBody,
  Container,
  Typography,
  TableContainer,
  TablePagination,
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
import AddAdmin from 'src/sections/admin/AddAdmin';
import UpdateAdmin from 'src/sections/admin/update-admin';
import SkeletonTabel from 'src/components/SkeletonTabel';
import { headerApi } from 'src/utils/headerApi';
import AdminTableRow from 'src/sections/admin/AdminTableRow';
import DeleteAdmin from 'src/sections/admin/DeleteAdmin';
import UpdateAdminPassword from 'src/sections/admin/UpdateAdminPassword';
import { logoutUser } from 'src/store/authSlice';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function Admin() {
  const dispatch = useDispatch()
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [anchorEl, setAnchorEl] = useState(null);

  const [selectedElement, setSelectedElement] = useState({});

  const handleOpenMenu = (event, id, admin) => {
    setSelectedElement(admin);
    setSelectedList(id);
    setAnchorEl(event.currentTarget);
  };

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

  // mu update
  const { token } = useSelector((state) => state.auth);

  const [admins, setAdmins] = useState([]);

  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    setLoadingData(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/admins`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setAdmins(res.data.admins);
        setLoadingData(false);
      })
      .catch((error) => {
        console.log(error);
        if(error.response.status === 401){
          dispatch(logoutUser())
        }
        setLoadingData(false);
      });
  }, [token]);

  const [OpenAdd, setOpenAdd] = useState(false);

  //handle delete admin

  const [selectedList, setSelectedList] = useState('');

  const [openDelete, setOpenDelete] = useState(false);

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  //handle update password
  const [openPassword, setOpenPassword] = useState(false);

  const handleClosePassword = () => {
    setOpenPassword(false);
    setAnchorEl(null);
  };

  const [openUpdate, setOpenUpdate] = useState(false);

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Admin
          </Typography>
          <Button onClick={() => setOpenAdd(true)} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Admin
          </Button>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {loadingData ? (
                    <SkeletonTabel />
                  ) : (
                    admins.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((eleemnt, index) => {
                      return <AdminTableRow key={index} element={eleemnt} handleOpenMenu={handleOpenMenu} />;
                    })
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
        <MenuItem onClick={() => setOpenPassword(true)}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Update Password
        </MenuItem>
        <MenuItem sx={{ color: 'error.main' }} onClick={() => setOpenDelete(true)}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <AddAdmin open={OpenAdd} setOpen={setOpenAdd} setData={setAdmins} handleCloseMenu={handleCloseMenu} />
      <UpdateAdmin
        open={openUpdate}
        setOpen={setOpenUpdate}
        setData={setAdmins}
        id={selectedList}
        element={selectedElement}
        handleCloseMenu={handleCloseMenu}
      />
      <DeleteAdmin
        open={openDelete}
        handleClose={handleCloseDelete}
        setData={setAdmins}
        handleCloseMenu={handleCloseMenu}
        id={selectedList}
      />
      <UpdateAdminPassword open={openPassword} handleClose={handleClosePassword} id={selectedList} />
    </>
  );
}
