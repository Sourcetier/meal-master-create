
import { useState } from 'react';
import { CreditCard, Truck, MapPin, ChevronLeft, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

interface PaymentDeliveryStepProps {
  orderData: any;
  onDataUpdate: (data: any) => void;
  onPrev: () => void;
  onSubmit: () => void;
}

const PaymentDeliveryStep = ({ orderData, onDataUpdate, onPrev, onSubmit }: PaymentDeliveryStepProps) => {
  const [submitting, setSubmitting] = useState(false);

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'juice', name: 'Juice Wallet', icon: CreditCard },
    { id: 'myt', name: 'My.t Money', icon: CreditCard },
    { id: 'bank', name: 'Bank Transfer', icon: CreditCard }
  ];

  const deliveryOptions = [
    { id: 'pickup', name: 'Pick-up', description: 'Collect from restaurant', icon: MapPin },
    { id: 'delivery', name: 'Delivery', description: 'Deliver to address', icon: Truck }
  ];

  const calculateTotal = () => {
    const subtotal = orderData.cart.reduce((total, item) => total + (item.item.price * item.quantity), 0);
    return subtotal * 1.15; // Including 15% tax
  };

  const handleSubmit = async () => {
    if (!orderData.paymentMethod || !orderData.deliveryOption) {
      return;
    }

    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSubmit();
    } catch (error) {
      console.error('Order submission failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment & Delivery Options */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Method */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={orderData.paymentMethod}
                onValueChange={(value) => onDataUpdate({ paymentMethod: value })}
                className="space-y-3"
              >
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <method.icon className="h-5 w-5 text-gray-600" />
                    <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                      {method.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Delivery Options */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-purple-600" />
                Delivery Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={orderData.deliveryOption}
                onValueChange={(value) => onDataUpdate({ deliveryOption: value })}
                className="space-y-3"
              >
                {deliveryOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <option.icon className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <Label htmlFor={option.id} className="cursor-pointer font-medium">
                        {option.name}
                      </Label>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              {orderData.deliveryOption === 'delivery' && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Delivery will be made to the customer's registered address.
                    Additional delivery charges may apply.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Special Instructions */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-purple-600" />
                Special Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="allergies" className="text-sm font-medium text-gray-700">
                  Allergies & Dietary Restrictions
                </Label>
                <Textarea
                  id="allergies"
                  placeholder="Please list any allergies or dietary restrictions..."
                  value={orderData.allergies || ''}
                  onChange={(e) => onDataUpdate({ allergies: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="deliveryNotes" className="text-sm font-medium text-gray-700">
                  Delivery Notes
                </Label>
                <Textarea
                  id="deliveryNotes"
                  placeholder="Special delivery instructions, building access codes, etc..."
                  value={orderData.deliveryNotes || ''}
                  onChange={(e) => onDataUpdate({ deliveryNotes: e.target.value })}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg border-0 sticky top-6">
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Customer Info */}
                <div className="pb-3 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900">Customer</h4>
                  <p className="text-sm text-gray-600">{orderData.customer?.name}</p>
                  <p className="text-sm text-gray-600">{orderData.customer?.phone}</p>
                </div>

                {/* Restaurant Info */}
                <div className="pb-3 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900">Restaurant</h4>
                  <p className="text-sm text-gray-600">{orderData.restaurant?.name}</p>
                  <p className="text-sm text-gray-600">{orderData.menu?.name}</p>
                </div>

                {/* Items */}
                <div className="pb-3 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Items ({orderData.cart?.length || 0})</h4>
                  <div className="space-y-2">
                    {orderData.cart?.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.quantity}x {item.item.name}
                        </span>
                        <span className="font-medium">
                          ${(item.item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment & Delivery */}
                <div className="pb-3 border-b border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment:</span>
                    <span className="font-medium">
                      {paymentMethods.find(p => p.id === orderData.paymentMethod)?.name || 'Not selected'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery:</span>
                    <span className="font-medium">
                      {deliveryOptions.find(d => d.id === orderData.deliveryOption)?.name || 'Not selected'}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${(calculateTotal() / 1.15).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (15%):</span>
                    <span className="font-medium">${(calculateTotal() * 0.15 / 1.15).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-purple-600">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!orderData.paymentMethod || !orderData.deliveryOption || submitting}
                  className="w-full py-3 text-lg"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrev}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous Step
        </Button>
      </div>
    </div>
  );
};

export default PaymentDeliveryStep;
