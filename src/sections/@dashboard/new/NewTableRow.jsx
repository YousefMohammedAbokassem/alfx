import { Avatar, IconButton, Link, Stack, TableCell, TableRow, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Iconify from 'src/components/iconify';

const NewTableRow = ({ _new, handleOpenMenu, mainPage }) => {
  const navigate = useNavigate();
  return (
    <TableRow
      hover
      tabIndex={-1}
      role="checkbox"
      sx={{ cursor: mainPage ? 'pointer' : '' }}
      // onClick={() => handleNavigate(_new.id)}
    >
      <TableCell component="th" scope="row">
        <Typography variant="subtitle2" noWrap>
          {_new?.title}
        </Typography>
      </TableCell>

      <TableCell align="left">{_new?.description}</TableCell>
      <TableCell align="left">
        <Avatar alt={_new?.title} src={`${process.env.REACT_APP_API_URL_IMAGE}${_new?.image}`} />
      </TableCell>

      <TableCell align="right">
        <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, _new, _new.id)}>
          <Iconify icon={'eva:more-vertical-fill'} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default NewTableRow;
