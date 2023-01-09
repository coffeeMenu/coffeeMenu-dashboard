import { ShoppingBagTwoTone } from '@mui/icons-material';
import { Button, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import AddProduct from '../../../components/dashboard/products/AddProduct';
import { useProducts } from '../../../contexts/ProductsProvider';
import { handleError } from '../../../modules/errorHandler';
import { pb } from '../../../modules/pocketbase';

const Products = () => {
  const storeId = localStorage.getItem('store');
  const { products, fetchAllProducts } = useProducts();
  const [loading, setLoading] = useState(true);
  const [isAnyProduct, setIsAnyProduct] = useState<boolean | undefined>();

  const [showAddProduct, setShowAddProduct] = useState(false);

  const checkIfAnyProduct = () => {
    pb.collection('products')
      .getList(1, 50, {
        filter: `store="${storeId}"`,
      })
      .then((res) => {
        const total = res.totalItems;
        if (total > 0) {
          fetchAllProducts();
          setIsAnyProduct(true);
        } else {
          setIsAnyProduct(false);
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

  if (loading && isAnyProduct === undefined) return <></>;

  const AddProductButton = (
    <Button
      onClick={() => {
        setShowAddProduct(true);
      }}
      sx={{ marginTop: 2 }}
      variant="contained"
    >
      Add Product
    </Button>
  );

  return (
    <>
      <AddProduct open={showAddProduct} setOpen={setShowAddProduct} />
      {isAnyProduct ? (
        <>
          {AddProductButton}
          {products &&
            products.map((p: any) => {
              return <Typography key={p.id}>{p.name}</Typography>;
            })}
        </>
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
          <Grid item>no product been has been added yet...</Grid>
          <Grid item>{AddProductButton}</Grid>
        </Grid>
      )}
    </>
  );
};

export default Products;
