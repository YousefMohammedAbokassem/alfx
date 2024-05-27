import PropTypes from 'prop-types';
// @mui
import { Box, Card, Button, Typography, Stack, CardActions } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/label';
import { useState } from 'react';
import DeleteProduct from '../product/delete-product';
import UpdateProduct from '../product/update-product';

// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------


export default function ShopProductCard({ product, setProducts, setSelectedElement,setOpenUpdate }) {
  const { name_ar, description_ar, image, priceCustomer, brand, id } = product;

  const [open, setOpen] = useState(false);


  const handleDelete = () => {
    setOpen(true);
  };

  // handle update
  // const [openUpdate, setOpenUpdate] = useState(false)
  const handleUpdate = () => {
    setOpenUpdate(true)
    setSelectedElement(product)
  }

  return (
    <>
      <Card>
        <Box sx={{ pt: '100%', position: 'relative' }}>
          <StyledProductImg alt={name_ar} src={`${process.env.REACT_APP_API_URL_IMAGE}${image}`} />
        </Box>

        <Stack spacing={2} sx={{ p: 1 }}>
          <Typography variant="h6" noWrap>
            {name_ar}
          </Typography>
          <Typography variant="h6" noWrap>
            {brand.name_ar}
          </Typography>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1">
              <Typography variant="body">{description_ar}</Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.disabled',
                }}
              >
                {priceCustomer}
              </Typography>
            </Typography>
          </Stack>
        </Stack>
        <CardActions>
          <Button onClick={handleUpdate}>Update</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </CardActions>
      </Card>
      <DeleteProduct open={open} setOpen={setOpen} id={id} setProducts={setProducts} />
    </>
  );
}
