import { ShoppingBagTwoTone } from '@mui/icons-material';
import { Button, Grid, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import AddProduct from '../../../components/dashboard/products/AddProduct';
import { useProducts } from '../../../contexts/ProductsProvider';
import { handleError } from '../../../modules/errorHandler';
import { pb } from '../../../modules/pocketbase';

const storeId = localStorage.getItem('store');

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [isProducts, setIsProducts] = useState<boolean | undefined>();

  const [showAddProduct, setShowAddProduct] = useState(false);

  const checkIfAnyProduct = () => {
    pb.collection('products')
      .getList(1, 50, {
        filter: `store="${storeId}"`,
        $autoCancel: false,
      })
      .then((res) => {
        const total = res.totalItems;
        if (total > 0) {
          setIsProducts(true);
        } else {
          setIsProducts(false);
        }
      })
      .catch((err) => {
        handleError(err, 'Products, useEffect(checkIfProduct)');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    checkIfAnyProduct();
  }, []);

  if (!loading && isProducts === undefined) return <></>;

  return (
    <>
      <AddProduct open={showAddProduct} setOpen={setShowAddProduct} />
      {isProducts ? (
        <>products exist</>
      ) : (
        <Grid
          container
          justifyContent={'center'}
          alignContent="center"
          justifyItems={'center'}
          direction="column"
          textAlign={'center'}
        >
          <Grid item>
            <ShoppingBagTwoTone sx={{ fontSize: 200, opacity: 0.1 }} />
          </Grid>
          <Grid item>no product been has been added...</Grid>
          <Grid item>
            <Button
              onClick={() => {
                setShowAddProduct(true);
              }}
              sx={{ marginTop: 2 }}
              variant="contained"
            >
              Add Product
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Products;
