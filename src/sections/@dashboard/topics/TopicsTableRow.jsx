import { IconButton, TableCell, TableRow } from '@mui/material';
import React from 'react';
import Iconify from 'src/components/iconify';

const TopicsTableRow = ({element, handleOpenMenu}) => {
  return (
    <>
      <TableRow sx={{ position: 'relative' }}>
        <TableCell>{element.name}</TableCell>
        {/* <TableCell>{element.user === null ? "No User Yet" : element.user.name}</TableCell> */}
        {/* <TableCell>{element.course.name}</TableCell> */}
        {/* <TableCell>{element.pos.name}</TableCell> */}
        <TableCell sx={{ display: 'flex', justifyContent: 'end' }}>
          <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, element.id, element)}>
            <Iconify icon={'eva:more-vertical-fill'} />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
};

export default TopicsTableRow;
