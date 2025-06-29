
import { useState, useEffect } from 'react';
import { Search, Store, ChevronLeft, MapPin, Clock, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  address: string;
  image: string;
}

interface Menu {
  id: string;
  name: string;
  description: string;
  restaurant_id: string;
}

interface RestaurantMenuStepProps {
  selectedRestaurant: Restaurant | null;
  selectedMenu: Menu | null;
  onRestaurantSelect: (restaurant: Restaurant) => void;
  onMenuSelect: (menu: Menu) => void;
  onNext: () => void;
  onPrev: () => void;
}

const RestaurantMenuStep = ({
  selectedRestaurant,
  selectedMenu,
  onRestaurantSelect,
  onMenuSelect,
  onNext,
  onPrev
}: RestaurantMenuStepProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [menusLoading, setMenusLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        // Mock API call - replace with actual API
        const mockRestaurants: Restaurant[] = [
          {
            id: '1',
            name: 'Pizza Palace',
            cuisine: 'Italian',
            rating: 4.5,
            deliveryTime: '25-35 min',
            address: '123 Italian St',
            image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop'
          },
          {
            id: '2',
            name: 'Burger House',
            cuisine: 'American',
            rating: 4.2,
            deliveryTime: '20-30 min',
            address: '456 Burger Ave',
            image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop'
          },
          {
            id: '3',
            name: 'Sushi Express',
            cuisine: 'Japanese',
            rating: 4.8,
            deliveryTime: '30-40 min',
            address: '789 Sushi Blvd',
            image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop'
          }
        ];
        setRestaurants(mockRestaurants);
        setFilteredRestaurants(mockRestaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    const filtered = restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRestaurants(filtered);
  }, [searchTerm, restaurants]);

  useEffect(() => {
    if (selectedRestaurant) {
      const fetchMenus = async () => {
        setMenusLoading(true);
        try {
          // Mock API call - replace with actual API
          const mockMenus: Menu[] = [
            {
              id: '1',
              name: 'Lunch Menu',
              description: 'Delicious lunch options available all day',
              restaurant_id: selectedRestaurant.id
            },
            {
              id: '2',
              name: 'Dinner Menu',
              description: 'Special dinner selections with premium ingredients',
              restaurant_id: selectedRestaurant.id
            },
            {
              id: '3',
              name: 'Weekend Special',
              description: 'Limited time weekend exclusive dishes',
              restaurant_id: selectedRestaurant.id
            }
          ];
          setMenus(mockMenus);
        } catch (error) {
          console.error('Error fetching menus:', error);
        } finally {
          setMenusLoading(false);
        }
      };

      fetchMenus();
    } else {
      setMenus([]);
    }
  }, [selectedRestaurant]);

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    onRestaurantSelect(restaurant);
    onMenuSelect(null); // Reset menu selection when restaurant changes
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="shadow-lg border-0">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Store className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Restaurant & Menu</h2>
            <p className="text-gray-600">Choose your preferred restaurant and menu</p>
          </div>

          {!selectedRestaurant ? (
            <>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search restaurants by name or cuisine..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 text-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading restaurants...</p>
                  </div>
                ) : filteredRestaurants.length > 0 ? (
                  filteredRestaurants.map((restaurant) => (
                    <Card
                      key={restaurant.id}
                      onClick={() => handleRestaurantSelect(restaurant)}
                      className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-gray-200 hover:border-purple-300"
                    >
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-white text-gray-800 flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{restaurant.rating}</span>
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">{restaurant.name}</h3>
                        <p className="text-purple-600 text-sm font-medium mb-2">{restaurant.cuisine}</p>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {restaurant.deliveryTime}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {restaurant.address}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No restaurants found</p>
                    <p className="text-sm text-gray-400">Try adjusting your search terms</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center mb-6">
                <Button
                  variant="ghost"
                  onClick={() => onRestaurantSelect(null)}
                  className="mr-4"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Restaurants
                </Button>
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedRestaurant.image}
                    alt={selectedRestaurant.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{selectedRestaurant.name}</h3>
                    <p className="text-purple-600 text-sm">{selectedRestaurant.cuisine}</p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Menu</h3>
              
              {menusLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading menus...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {menus.map((menu) => (
                    <Card
                      key={menu.id}
                      onClick={() => onMenuSelect(menu)}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedMenu?.id === menu.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{menu.name}</h4>
                        <p className="text-gray-600 text-sm">{menu.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={onPrev}>
              Previous Step
            </Button>
            <Button
              onClick={onNext}
              disabled={!selectedRestaurant || !selectedMenu}
              className="px-8"
            >
              Continue to Order Selection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantMenuStep;
