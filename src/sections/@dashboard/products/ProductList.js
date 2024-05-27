import PropTypes from 'prop-types';
// @mui
import { Grid, Typography } from '@mui/material';
import ShopProductCard from './ProductCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import SkeletonCopm from 'src/components/skeleton-comp';
import UpdateProduct from '../product/update-product';

// ----------------------------------------------------------------------

export default function ProductList({ products, loading, setProducts }) {
  const { eshoppingtoken } = useSelector((state) => state.auth);

  const [selectedElement, setSelectedElement] = useState({});

  const [openUpdate, setOpenUpdate] = useState(false);

  return (
    <Grid container spacing={3}>
      {
         products.length ? 
        products.map((product, index) => (
          <Grid key={index} item xs={12} sm={6} md={3}>
            <ShopProductCard
              product={product}
              id={product.id}
              setProducts={setProducts}
              setSelectedElement={setSelectedElement}
              setOpenUpdate={setOpenUpdate}
            />
          </Grid>
        ))
       : (
        <Typography variant="h6" sx={{ margin: 'auto' }}>
          There is no product in this category
        </Typography>
      )}
      {openUpdate && <UpdateProduct open={openUpdate} setOpen={setOpenUpdate} product={selectedElement} />}
    </Grid>
  );
}
