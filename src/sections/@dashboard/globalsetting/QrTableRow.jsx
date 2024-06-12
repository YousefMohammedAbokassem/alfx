import { IconButton, TableCell, TableRow } from '@mui/material';
import React from 'react';
import Iconify from 'src/components/iconify';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
const QrTableRow = ({ element, handleOpenMenu }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  console.log(element.courses);
  return (
    <>
      <TableRow sx={{ position: 'relative' }}>
        <TableCell>{element.code}</TableCell>
        <TableCell>{element.pos.name}</TableCell>
        <TableCell>
          <Button
            id="fade-button"
            aria-controls={open ? 'fade-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            variant="contained"
          >
            Courses
          </Button>
          <Menu
            id="fade-menu"
            MenuListProps={{
              'aria-labelledby': 'fade-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            {element.courses?.map((course) => {
              return <MenuItem onClick={handleClose}>{course?.name}</MenuItem>;
            })}
          </Menu>
        </TableCell>
        <TableCell sx={{ display: 'flex', justifyContent: 'end' }}>
          <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, element.id, element)}>
            <Iconify icon={'eva:more-vertical-fill'} /> 
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
};

export default QrTableRow;
