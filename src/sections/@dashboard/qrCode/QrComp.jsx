import {
  Card,
  CircularProgress,
  Container,
  MenuItem,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import React, { useState } from 'react';
import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify';
import USERLIST from '../../../_mock/user';
import SkeletonTable from 'src/components/SkeletonTabel';
import QrTableRow from './QrTableRow';
import DeleteQr from '../globalsetting/DeleteQr';
import UpdateQr from './UpdateQr';
import { ProductFilterSidebar } from '../products';

const QrComp = ({ QrLoading, setQrLoading, qrCode, setQrCode, setSelectedId, selectedId }) => {
  //handle pagination
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event, id, element) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
    setSelectedUpdate(element);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  //handle delete

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  const handleClose = () => {
    setOpenDelete(false);
  };

  //handle update
  const [openUpdate, setOpenUpdate] = useState(false);

  const [selectedUpdate, setSelectedUpdate] = useState({});

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  // handle filter
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <>
      <Container>
        <ProductFilterSidebar
          openFilter={openFilter}
          onOpenFilter={handleOpenFilter}
          onCloseFilter={handleCloseFilter}
          setQrLoading={setQrLoading}
          setQrCode={setQrCode}
        />
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Pos</TableCell>
                    <TableCell>User device id</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {QrLoading ? (
                    <SkeletonTable number={4} />
                  ) : (
                    qrCode
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((element, index) => (
                        <QrTableRow
                          key={index}
                          element={element}
                          handleOpenMenu={handleOpenMenu}
                          setSelectedUpdate={setSelectedUpdate}
                        />
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
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
          Update Qr Code
        </MenuItem>
        <MenuItem sx={{ color: 'error.main' }} onClick={() => setOpenDelete(true)}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          {deleteLoading ? <CircularProgress size={20} /> : 'Delete'}
        </MenuItem>
      </Popover>
      <DeleteQr
        open={openDelete}
        handleClose={handleClose}
        setData={setQrCode}
        id={selectedId}
        setAnchorEl={setAnchorEl}
      />
      <UpdateQr
        handleCloseMenu={handleCloseMenu}
        open={openUpdate}
        handleClose={handleCloseUpdate}
        setData={setQrCode}
        element={selectedUpdate}
      />
    </>
  );
};

export default QrComp;
