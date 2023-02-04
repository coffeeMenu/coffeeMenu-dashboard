import {
  DeleteTwoTone,
  EditTwoTone,
  ShoppingBagTwoTone,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import DeleteProduct from '../../../components/dashboard/products/DeleteProduct';
import { useProducts } from '../../../contexts/ProductsProvider';
import { handleError } from '../../../modules/errorHandler';
import { apiUrl, pb } from '../../../modules/pocketbase';
import AddProduct from '../../../components/dashboard/products/AddProduct';
import EditProduct from '../../../components/dashboard/products/EditProduct';

const Products = () => {
  const storeId = localStorage.getItem('store');
  const { products, fetchAllProducts } = useProducts();
  const [loading, setLoading] = useState(true);
  const [openDeleteProduct, setOpenDeleteProduct] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState({
    name: '',
    id: '',
  });

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editProduct, setEditProduct] = useState<any>();

  const checkIfAnyProduct = () => {
      pb.collection('products')
          .getList(1, 50, {
              filter: `store="${storeId}"`,
          })
          .then((res) => {
              const total = res.totalItems;
              if (total > 0) {
                  fetchAllProducts();
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

  const handleDelete = (id: string, name: string) => {
      setOpenDeleteProduct(true);
      setDeleteProduct({ id: id, name: name });
  };

  if (loading && products === undefined) return <></>;

  const AddProductButton = (
      <Button
          onClick={() => {
              setShowAddProduct(true);
          }}
          sx={{ marginTop: 2 }}
          variant="contained">
          {/* TODO sticky */}
          Add Product
      </Button>
  );

  return (
      <>
          <AddProduct open={showAddProduct} setOpen={setShowAddProduct} />
          {editProduct && <EditProduct open={showEditProduct} setOpen={setShowEditProduct} product={editProduct} />}

          <DeleteProduct open={openDeleteProduct} setOpen={setOpenDeleteProduct} id={deleteProduct.id} name={deleteProduct.name} />
          {products?.length > 0 ? (
              // TODO on product click show a product drawer with detailed information
              <>
                  {AddProductButton}
                  <List sx={{ width: '100%' }}></List>
                  {products &&
                      products.map((p: any) => {
                          return (
                              <ListItem
                                  key={p.id}
                                  sx={{
                                      border: '0.5px solid #333',
                                      borderRadius: 10,
                                      marginY: 1,
                                      opacity: p.available ? 1 : 0.5,
                                  }}>
                                  <ListItemAvatar>
                                      <Avatar alt={p.name + ' ' + p.description} src={p.pictures[0] && `${apiUrl}/api/files/${p.collectionId}/${p.id}/${p.pictures[0]}`} />
                                  </ListItemAvatar>
                                  <ListItemText
                                      primary={
                                          <>
                                              <Typography>{p.name}</Typography>
                                          </>
                                      }
                                  />
                                  <Box
                                      component={'span'}
                                      // {/* TODO $/euro/﷼/تومان */}
                                      sx={{ color: 'gray', marginRight: 1 }}>
                                      {p.price}
                                  </Box>
                                  <IconButton
                                      onClick={() => {
                                          setEditProduct(p);
                                          setShowEditProduct(true);
                                      }}>
                                      <EditTwoTone sx={{ opacity: 0.8, color: p.available ? '' : 'gray' }} color="primary" />
                                      {/* TODO: move disabled to the end of the sort */}
                                  </IconButton>
                                  <IconButton onClick={() => handleDelete(p.id, p.name)}>
                                      <DeleteTwoTone sx={{ opacity: 0.8, color: p.available ? '' : 'gray' }} color="error" />
                                  </IconButton>
                              </ListItem>
                          );
                      })}
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
              </>
          ) : (
              <Grid container justifyContent={'center'} alignContent="center" justifyItems={'center'} direction="column" textAlign={'center'}>
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
