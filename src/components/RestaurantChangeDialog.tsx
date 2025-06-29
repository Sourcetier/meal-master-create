
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from './ui/alert-dialog';

interface RestaurantChangeDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  restaurantName: string;
  itemCount: number;
}

const RestaurantChangeDialog = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  restaurantName, 
  itemCount 
}: RestaurantChangeDialogProps) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change Restaurant?</AlertDialogTitle>
          <AlertDialogDescription>
            You currently have {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart. 
            Changing to "{restaurantName}" will remove all items from your current order.
            <br /><br />
            <strong>This action cannot be undone.</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            Keep Current Order
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Change Restaurant & Clear Cart
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RestaurantChangeDialog;
