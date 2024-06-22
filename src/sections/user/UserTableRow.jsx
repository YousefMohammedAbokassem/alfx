import { Avatar, IconButton, Stack, TableCell, TableRow, Typography } from '@mui/material';
import React from 'react';
import Iconify from 'src/components/iconify';

const UserTableRow = ({ element, handleOpenMenu }) => {
  return (
    <>
      <TableRow sx={{ cursor: 'pointer' }}>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2} ml={1}>
            <Avatar alt={element.name} src={`${process.env.REACT_APP_API_URL_IMAGE}${element.image}`} />
            <Typography variant="subtitle2" noWrap>
              {element.name}
            </Typography>
          </Stack>
        </TableCell>{' '}
        <TableCell align="left">{element.email}</TableCell>
        <TableCell align="left">{element.device_id}</TableCell>
        <TableCell align="left">{element.city.name}</TableCell>
        <TableCell align="right">
          <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, element.id, element)}>
            <Iconify icon={'eva:more-vertical-fill'} />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
};

export default UserTableRow;
