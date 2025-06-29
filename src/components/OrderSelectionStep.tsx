
import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  menu_id: string;
}

interface CartItem {
  id: string;
  item: MenuItem;
  quantity: number;
  notes: string;
  modifiers: any[];
}

interface OrderSelectionStepProps {
  restaurant: any;
  menu: any;
  cart: CartItem[];
  onCartUpdate: (cart: CartItem[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

const OrderSelectionStep = ({
  restaurant,
  menu,
  cart,
  onCartUpdate,
  onNext,
  onPrev
}: OrderSelectionStepProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (menu) {
      fetchCategoriesAndItems();
    }
  }, [menu]);

  const fetchCategoriesAndItems = async () => {
    setLoading(true);
    try {
      // Mock API calls - replace with actual API
      const mockCategories: Category[] = [
        { id: '1', name: 'Appetizers', menu_id: menu.id },
        { id: '2', name: 'Main Courses', menu_id: menu.id },
        { id: '3', name: 'Desserts', menu_id: menu.id },
        { id: '4', name: 'Beverages', menu_id: menu.id }
      ];

      const mockItems: MenuItem[] = [
        {
          id: '1',
          name: 'Caesar Salad',
          description: 'Fresh romaine lettuce with parmesan cheese and croutons',
          price: 12.99,
          image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop',
          category_id: '1'
        },
        {
          id: '2',
          name: 'Grilled Chicken',
          description: 'Tender grilled chicken breast with herbs and spices',
          price: 18.99,
          image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=200&fit=crop',
          category_id: '2'
        },
        {
          id: '3',
          name: 'Chocolate Cake',
          description: 'Rich chocolate cake with vanilla frosting',
          price: 8.99,
          image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=200&fit=crop',
          category_id: '3'
        },
        {
          id: '4',
          name: 'Fresh Juice',
          description: 'Freshly squeezed orange juice',
          price: 4.99,
          image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=300&h=200&fit=crop',
          category_id: '4'
        }
      ];

      setCategories(mockCategories);
      setItems(mockItems);
      setSelectedCategory(mockCategories[0]?.id || '');
    } catch (error) {
      console.error('Error fetching menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    const existingItemIndex = cart.findIndex(cartItem => cartItem.item.id === item.id);
    
    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      onCartUpdate(updatedCart);
    } else {
      const newCartItem: CartItem = {
        id: `${item.id}-${Date.now()}`,
        item,
        quantity: 1,
        notes: '',
        modifiers: []
      };
      onCartUpdate([...cart, newCartItem]);
    }
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(cartItemId);
      return;
    }

    const updatedCart = cart.map(item =>
      item.id === cartItemId ? { ...item, quantity: newQuantity } : item
    );
    onCartUpdate(updatedCart);
  };

  const removeFromCart = (cartItemId: string) => {
    const updatedCart = cart.filter(item => item.id !== cartItemId);
    onCartUpdate(updatedCart);
  };

  const updateNotes = (cartItemId: string, notes: string) => {
    const updatedCart = cart.map(item =>
      item.id === cartItemId ? { ...item, notes } : item
    );
    onCartUpdate(updatedCart);
  };

  const getCartItemQuantity = (itemId: string) => {
    const cartItem = cart.find(item => item.item.id === itemId);
    return cartItem?.quantity || 0;
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.item.price * item.quantity), 0);
  };

  const filteredItems = selectedCategory 
    ? items.filter(item => item.category_id === selectedCategory)
    : items;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Menu Items */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <ShoppingCart className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Select Items</h2>
                  <p className="text-gray-600">{restaurant?.name} - {menu?.name}</p>
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading menu items...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="border border-gray-200 hover:border-gray-300 transition-colors">
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-white text-purple-600 font-semibold">
                            ${item.price}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-purple-600">${item.price}</span>
                          
                          {getCartItemQuantity(item.id) > 0 ? (
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const cartItem = cart.find(ci => ci.item.id === item.id);
                                  if (cartItem) {
                                    updateQuantity(cartItem.id, cartItem.quantity - 1);
                                  }
                                }}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="font-semibold text-lg min-w-[2rem] text-center">
                                {getCartItemQuantity(item.id)}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const cartItem = cart.find(ci => ci.item.id === item.id);
                                  if (cartItem) {
                                    updateQuantity(cartItem.id, cartItem.quantity + 1);
                                  }
                                }}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button onClick={() => addToCart(item)} size="sm">
                              <Plus className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cart */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg border-0 sticky top-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-purple-600" />
                Your Order ({cart.length})
              </h3>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                  <p className="text-sm text-gray-400">Add items to get started</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {cart.map((cartItem) => (
                      <div key={cartItem.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{cartItem.item.name}</h4>
                          <button
                            onClick={() => removeFromCart(cartItem.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-purple-600 font-semibold">
                            ${cartItem.item.price} × {cartItem.quantity}
                          </span>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-semibold min-w-[1.5rem] text-center">
                              {cartItem.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <Textarea
                          placeholder="Special instructions..."
                          value={cartItem.notes}
                          onChange={(e) => updateNotes(cartItem.id, e.target.value)}
                          className="text-sm"
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Tax (15%):</span>
                      <span className="font-semibold">${(calculateTotal() * 0.15).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-purple-600">${(calculateTotal() * 1.15).toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrev}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous Step
        </Button>
        <Button
          onClick={onNext}
          disabled={cart.length === 0}
          className="px-8"
        >
          Continue to Payment & Delivery
        </Button>
      </div>
    </div>
  );
};

export default OrderSelectionStep;
