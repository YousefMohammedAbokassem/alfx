  import PropTypes from 'prop-types';
  // @mui
  import {
    Box,
    Radio,
    Stack,
    Button,
    Drawer,
    Divider,
    IconButton,
    Typography,
    RadioGroup,
    FormControlLabel,
    TextField,
  } from '@mui/material';
  // components
  import Iconify from '../../../components/iconify';
  import Scrollbar from '../../../components/scrollbar';
  import { useEffect, useState } from 'react';
  import axios from 'axios';
  import { headerApi } from 'src/utils/headerApi';
  import { useSelector } from 'react-redux';
  import { useParams } from 'react-router-dom';

  // ----------------------------------------------------------------------

  export const SORT_BY_OPTIONS = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'priceDesc', label: 'Price: High-Low' },
    { value: 'priceAsc', label: 'Price: Low-High' },
  ];
  export const FILTER_GENDER_OPTIONS = ['Men', 'Women', 'Kids'];
  export const FILTER_CATEGORY_OPTIONS = ['All', 'Shose', 'Apparel', 'Accessories'];
  export const FILTER_RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];
  export const FILTER_PRICE_OPTIONS = [
    { value: 'below', label: 'Below $25' },
    { value: 'between', label: 'Between $25 - $75' },
    { value: 'above', label: 'Above $75' },
  ];
  export const FILTER_COLOR_OPTIONS = [
    '#00AB55',
    '#000000',
    '#FFFFFF',
    '#FFC0CB',
    '#FF4842',
    '#1890FF',
    '#94D82D',
    '#FFC107',
  ];

  // ----------------------------------------------------------------------

  ShopFilterSidebar.propTypes = {
    openFilter: PropTypes.bool,
    onOpenFilter: PropTypes.func,
    onCloseFilter: PropTypes.func,
  };

  export default function ShopFilterSidebar({ openFilter, onOpenFilter, onCloseFilter, setQrLoading, setQrCode }) {
    const { token } = useSelector((state) => state.auth);
    const { id } = useParams();

    const [pos, setPos] = useState([]);

    const [selectedPos, setSelectedPos] = useState('');

    console.log(selectedPos)
    const handleCloseFilter = () => {
      onCloseFilter()
      setSearch("")
      setSelectedPos("")
    }

    const handlePosChange = (event) => {
      setSelectedPos(event.target.value); 
    };

    useEffect(() => {
      axios
        .get(`${process.env.REACT_APP_API_URL}admin/pos`, {
          headers: headerApi(token),
        })
        .then((res) => {
          setPos(res.data.pos);
        })
        .catch((error) => {
          console.log(error);
        });
    }, [token]);

    const [search, setSearch] = useState('');

    console.log(search)

    const handleFilter = () => {
      setQrLoading(true);
      onCloseFilter();
      axios
        .get(`${process.env.REACT_APP_API_URL}admin/qr_codes/course/${id}?code=${search}&pos_id=${selectedPos}`, {
          headers: headerApi(token),
        })
        .then((res) => {
          console.log(res);
          setQrLoading(false);
          handleCloseFilter();
          setQrCode(res.data.qr_codes);
        })
        .catch((error) => {
          console.log(error);
          setQrLoading(false);
        });
    };

    return (
      <>
        <Button disableRipple color="inherit" endIcon={<Iconify icon="ic:round-filter-list" />} onClick={onOpenFilter}>
          Filters&nbsp;
        </Button>

        <Drawer
          anchor="right"
          open={openFilter}
          onClose={handleCloseFilter}
          PaperProps={{
            sx: { width: 280, border: 'none', overflow: 'hidden' },
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              Filters
            </Typography>
            <IconButton onClick={handleCloseFilter}>
              <Iconify icon="eva:close-fill" />
            </IconButton>
          </Stack>

          <Divider />

          <Scrollbar>
            <Stack spacing={3} sx={{ p: 3 }}>
              <div>
                <TextField label="Code" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>

              <div>
                <Typography variant="subtitle1" gutterBottom>
                  Point of Sales
                </Typography>
                <RadioGroup value={selectedPos} onChange={handlePosChange}>
                  {pos.map((item) => (
                    <FormControlLabel key={item} value={item.id} control={<Radio />} label={item.name} />
                  ))}
                </RadioGroup>
              </div>
            </Stack>

            <Box sx={{ p: 3 }}>
              <Button
                fullWidth
                size="large"
                type="submit"
                color="inherit"
                variant="outlined"
                startIcon={<Iconify icon="ic:round-clear-all" />}
                onClick={handleFilter}
              >
                Filter
              </Button>
            </Box>
          </Scrollbar>

          <Box sx={{ p: 3 }}>
            <Button
              fullWidth
              size="large"
              type="submit"
              color="inherit"
              variant="outlined"
              startIcon={<Iconify icon="ic:round-clear-all" />}
            >
              Clear All
            </Button>
          </Box>
        </Drawer>
      </>
    );
  }
