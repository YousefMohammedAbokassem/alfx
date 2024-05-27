import { Avatar, IconButton, Link, Stack, TableCell, TableRow, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Iconify from 'src/components/iconify';

const TeacherTableRow = ({ teacher, handleOpenMenu, mainPage }) => {
  const handleNavigate = (id) => {
    if (mainPage) {
      navigate(`/dashboard/teacher/details/${id}`);
    }
  };

  const navigate = useNavigate();
  return (
    <TableRow
      hover
      tabIndex={-1}
      role="checkbox"
      sx={{ cursor: mainPage ? 'pointer' : '' }}
      onClick={() => handleNavigate(teacher.id)}
    >
      <TableCell component="th" scope="row" padding="none">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={teacher.name} src={`${process.env.REACT_APP_API_URL_IMAGE}${teacher.image}`} />
          <Typography variant="subtitle2" noWrap>
            {teacher.name}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="left">{teacher.phone}</TableCell>

      <TableCell align="left">{teacher.description}</TableCell>
      <TableCell align="left">{teacher.specialization}</TableCell>
      <TableCell align="left">
        <Link target="_blank" href={teacher.youtube_link} variant="body2" onClick={(event) => event.stopPropagation()}>
          Link
        </Link>
      </TableCell>
      <TableCell align="left">
        <Link target="_blank" href={teacher.telegram_link} variant="body2" onClick={(event) => event.stopPropagation()}>
          Link
        </Link>
      </TableCell>
      <TableCell align="left">{teacher.city}</TableCell>
      <TableCell align="right">
        <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, teacher, teacher.id)}>
          <Iconify icon={'eva:more-vertical-fill'} />
        </IconButton>
      </TableCell>
      {/* )} */}
    </TableRow>
  );
};

export default TeacherTableRow;
