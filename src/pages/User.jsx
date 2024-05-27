import { Card, CircularProgress, Container, MenuItem, Popover, Stack, Table, TableBody, TableContainer, TablePagination, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import SkeletonTable from 'src/components/SkeletonTabel';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { UserListHead } from 'src/sections/@dashboard/user';
import UserTableRow from 'src/sections/user/UserTableRow';
import { headerApi } from 'src/utils/headerApi';
import USERLIST from '../_mock/user';
import UpdateUser from 'src/sections/user/UpdateUser';
import DeleteUser from 'src/sections/user/DeleteUser';



const TABLE_HEAD = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'device_id', label: 'Device Id', alignRight: false },
    { id: 'city', label: 'City', alignRight: false },
    { id: '' },
  ];

const User = () => {
    const {token} = useSelector(state => state.auth)

    const [loading, setLoading] = useState(false)


    const [user, setUser] = useState([])

    useEffect(() => {
      setLoading(true)
        axios.get(`${process.env.REACT_APP_API_URL}admin/users`, {
            headers: headerApi(token)
        })
        .then(res => {
            setLoading(false)
            setUser(res.data.users)
        })
        .catch(error => {
            console.log(error)
            setLoading(false)
        })
    }, [token])


    // handle table 
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleOpenMenu = (event, id, element) => {
        setAnchorEl(event.currentTarget);
        setSelectedList(id);
        setSetSelectedUser(element)
      };

      const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };

      const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
      };

      // handle popover 
      const [anchorEl, setAnchorEl] = useState(null);

      const handleCloseMenu = () => {
        setAnchorEl(null);
      };


      // handle update
      const [openUpdate, setOpenUpdate] = useState(false);

      const [selectedList, setSelectedList] = useState('');
      
      const [setSelectedUser, setSetSelectedUser] = useState({})

      const handleCloseUpdate = () => {
        setOpenUpdate(false)
        setAnchorEl(null)
      }

      // handle delete 
      const [openDelete, setOpenDelete] = useState(false)

      const handleCloseDelete = () => {
        setOpenDelete(false)
        setAnchorEl(null)
      }


  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
        </Stack>
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
              <UserListHead headLabel={TABLE_HEAD} />
                <TableBody>
                    {
                        loading ? <SkeletonTable number={4} />
                        :
                        user.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((element, index) => (
                            <UserTableRow key={index} element={element} handleOpenMenu={handleOpenMenu} /> 
                        ))
                    }
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
          Update User
        </MenuItem>
        <MenuItem onClick={() => setOpenDelete(true)}>
        <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete User
        </MenuItem>
      </Popover>
      <DeleteUser open={openDelete} handleClose={handleCloseDelete} id={selectedList} setData={setUser} />
      <UpdateUser open={openUpdate} handleClose={handleCloseUpdate} element={setSelectedUser} setData={setUser} />
    </>
  );
};

export default User;
