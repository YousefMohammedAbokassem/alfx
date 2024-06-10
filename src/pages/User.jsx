import {
  Card,
  CircularProgress,
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
import UserTableRow from 'src/sections/user/UserTableRow';
import { headerApi } from 'src/utils/headerApi';
import USERLIST from '../_mock/user';
import UpdateUser from 'src/sections/user/UpdateUser';
import DeleteUser from 'src/sections/user/DeleteUser';
import Teacher from './Teacher';
import Student from './Student';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'device_id', label: 'Device Id', alignRight: false },
  { id: 'city', label: 'City', alignRight: false },
  { id: '' },
];

const User = () => {
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/users`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setLoading(false);
        setUser(res.data.users);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [token]);

  // handle table
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenMenu = (event, id, element) => {
    setAnchorEl(event.currentTarget);
    setSelectedList(id);
    setSetSelectedUser(element);
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

  const [setSelectedUser, setSetSelectedUser] = useState({});

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setAnchorEl(null);
  };

  // handle delete
  const [openDelete, setOpenDelete] = useState(false);

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setAnchorEl(null);
  };

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>
      <Container>
        <Teacher />
        <Student />
      </Container>
    </>
  );
};

export default User;
