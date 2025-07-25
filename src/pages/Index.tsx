
import { useState } from 'react';
import CustomerSearchStep from '../components/CustomerSearchStep';
import RestaurantMenuStep from '../components/RestaurantMenuStep';
import OrderSelectionStep from '../components/OrderSelectionStep';
import PaymentDeliveryStep from '../components/PaymentDeliveryStep';
import StepIndicator from '../components/StepIndicator';
import RestaurantChangeDialog from '../components/RestaurantChangeDialog';

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showRestaurantChangeDialog, setShowRestaurantChangeDialog] = useState(false);
  const [pendingRestaurant, setPendingRestaurant] = useState(null);
  const [orderData, setOrderData] = useState({
    customer: null,
    restaurant: null,
    menu: null,
    cart: [],
    paymentMethod: '',
    deliveryOption: '',
    allergies: '',
    deliveryNotes: ''
  });

  const steps = [
    { id: 1, name: 'Customer', description: 'Select customer' },
    { id: 2, name: 'Restaurant', description: 'Choose restaurant & menu' },
    { id: 3, name: 'Order', description: 'Select items' },
    { id: 4, name: 'Payment', description: 'Payment & delivery' }
  ];

  const updateOrderData = (data) => {
    setOrderData(prev => ({ ...prev, ...data }));
  };

  const handleCustomerSelect = (customer) => {
    // If changing customer and cart has items, clear the cart
    if (orderData.cart.length > 0 && orderData.customer?.id !== customer?.id) {
      updateOrderData({ 
        customer, 
        cart: [], 
        restaurant: null, 
        menu: null 
      });
    } else {
      updateOrderData({ customer });
    }
  };

  const handleRestaurantSelect = (restaurant) => {
    // If there are items in cart and trying to change restaurant
    if (orderData.cart.length > 0 && orderData.restaurant?.id !== restaurant?.id) {
      setPendingRestaurant(restaurant);
      setShowRestaurantChangeDialog(true);
      return;
    }
    
    // If no items in cart or same restaurant, proceed normally
    updateOrderData({ restaurant, menu: null });
  };

  const confirmRestaurantChange = () => {
    updateOrderData({ 
      restaurant: pendingRestaurant, 
      menu: null, 
      cart: [] 
    });
    setShowRestaurantChangeDialog(false);
    setPendingRestaurant(null);
  };

  const cancelRestaurantChange = () => {
    setShowRestaurantChangeDialog(false);
    setPendingRestaurant(null);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CustomerSearchStep
            selectedCustomer={orderData.customer}
            onCustomerSelect={handleCustomerSelect}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <RestaurantMenuStep
            selectedRestaurant={orderData.restaurant}
            selectedMenu={orderData.menu}
            onRestaurantSelect={handleRestaurantSelect}
            onMenuSelect={(menu) => updateOrderData({ menu })}
            onNext={nextStep}
            onPrev={prevStep}
            hasCartItems={orderData.cart.length > 0}
          />
        );
      case 3:
        return (
          <OrderSelectionStep
            restaurant={orderData.restaurant}
            menu={orderData.menu}
            cart={orderData.cart}
            onCartUpdate={(cart) => updateOrderData({ cart })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <PaymentDeliveryStep
            orderData={orderData}
            onDataUpdate={updateOrderData}
            onPrev={prevStep}
            onSubmit={() => console.log('Order submitted:', orderData)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Order</h1>
          <p className="text-lg text-gray-600">Follow the steps below to place your order</p>
        </div>
        
        <StepIndicator steps={steps} currentStep={currentStep} />
        
        <div className="mt-8">
          {renderCurrentStep()}
        </div>
      </div>

      <RestaurantChangeDialog
        isOpen={showRestaurantChangeDialog}
        onConfirm={confirmRestaurantChange}
        onCancel={cancelRestaurantChange}
        restaurantName={pendingRestaurant?.name || ''}
        itemCount={orderData.cart.length}
      />
    </div>
  );
};

export default Index;
