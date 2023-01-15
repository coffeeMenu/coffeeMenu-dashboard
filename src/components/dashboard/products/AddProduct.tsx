import ProductDrawer from './productDrawer/ProductDrawer';
import { initialState } from './productDrawer/reducer';
type Props = {
  open: boolean;
  setOpen: Function;
};
const AddProduct: React.FC<Props> = ({ open = false, setOpen }) => {
  return (
    <ProductDrawer open={open} setOpen={setOpen} initialState={initialState} />
  );
};

export default AddProduct;
