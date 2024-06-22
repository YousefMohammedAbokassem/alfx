import { Avatar, IconButton, Link, Stack, TableCell, TableRow, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Iconify from 'src/components/iconify';

const StudentTableRow = ({ student, handleOpenMenu, mainPage }) => {
  // const handleNavigate = (id) => {
  //   if (mainPage) {
  //     navigate(`/dashboard/SpecialStudent?id=${id}`);
  //   }
  // };
  const navigate = useNavigate();
  return (
    <TableRow
      hover
      tabIndex={-1}
      role="checkbox"
      sx={{ cursor: mainPage ? 'pointer' : '' }}
      // onClick={() => handleNavigate(student.id)}
    >
      <TableCell component="th" scope="row">
        <Typography variant="subtitle2" noWrap>
          {student?.name}
        </Typography>
      </TableCell>
      <TableCell component="th" scope="row">
        <Typography variant="subtitle2" noWrap>
          {student?.email}
        </Typography>
      </TableCell>
      <TableCell component="th" scope="row">
        <Typography variant="subtitle2" noWrap>
          {student?.phone}
        </Typography>
      </TableCell>
      <TableCell component="th" scope="row">
        <Typography variant="subtitle2" noWrap>
          {student?.blocked == 1 ? 'Available' : 'Unavailable'}
        </Typography>
      </TableCell>
      <TableCell component="th" scope="row">
        <Typography variant="subtitle2" noWrap>
          {student?.device_id || 'null'}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, student, student.id)}>
          <Iconify icon={'eva:more-vertical-fill'} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default StudentTableRow;
