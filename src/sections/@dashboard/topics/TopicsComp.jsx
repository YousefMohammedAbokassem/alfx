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
  import TopicsTableRow from './TopicsTableRow';
  import DeleteTopics from './DeleteTopics';
  import UpdateTopics from './UpdateTopics';
  
  const TopicsComp = ({ topicsLoading, topics, setTopics, setSelectedElement, selectedTopics, setSelecedTopics }) => {
  
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
      setSelecedTopics(id);
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
  
    const [selectedUpdate, setSelectedUpdate] = useState({})
  
    const handleCloseUpdate = () => {
      setOpenUpdate(false);
      setAnchorEl(null)
    };
  
    return (
      <>
        <Container>
          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topicsLoading ? (
                      <SkeletonTable number={4} />
                    ) : (
                        topics
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((element, index) => (
                          <TopicsTableRow key={index} element={element} handleOpenMenu={handleOpenMenu} setSelectedUpdate={setSelectedUpdate} />
                        ))
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
            Update Topic
          </MenuItem>
          <MenuItem sx={{ color: 'error.main' }} onClick={() => setOpenDelete(true)}>
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
            {deleteLoading ? <CircularProgress size={20} /> : 'Delete'}
          </MenuItem>
        </Popover>
        <DeleteTopics
          open={openDelete}
          handleClose={handleClose}
          setData={setTopics}
          id={selectedTopics}
          setAnchorEl={setAnchorEl}
        />
        <UpdateTopics open={openUpdate} handleClose={handleCloseUpdate} setData={setTopics} element={selectedUpdate} />
      </>
    );
  };
  
  export default TopicsComp;
  