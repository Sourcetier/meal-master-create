
import { useState, useEffect } from 'react';
import { Search, User, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface CustomerSearchStepProps {
  selectedCustomer: Customer | null;
  onCustomerSelect: (customer: Customer) => void;
  onNext: () => void;
}

const CustomerSearchStep = ({ selectedCustomer, onCustomerSelect, onNext }: CustomerSearchStepProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        // Mock API call - replace with actual API
        const mockCustomers: Customer[] = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1 234 567 8900',
            address: '123 Main St, City, State'
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+1 234 567 8901',
            address: '456 Oak Ave, City, State'
          },
          {
            id: '3',
            name: 'Mike Johnson',
            email: 'mike@example.com',
            phone: '+1 234 567 8902',
            address: '789 Pine Rd, City, State'
          }
        ];
        setCustomers(mockCustomers);
        setFilteredCustomers(mockCustomers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const handleCustomerSelect = (customer: Customer) => {
    onCustomerSelect(customer);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg border-0">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Customer</h2>
            <p className="text-gray-600">Search and select a customer to start the order</p>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by name, email, or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          {selectedCustomer && (
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedCustomer.name}</h3>
                  <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading customers...</p>
              </div>
            ) : filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => handleCustomerSelect(customer)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedCustomer?.id === customer.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {customer.phone}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {customer.address}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No customers found</p>
                <p className="text-sm text-gray-400">Try adjusting your search terms</p>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-8">
            <Button
              onClick={onNext}
              disabled={!selectedCustomer}
              className="px-8 py-3 text-lg"
            >
              Continue to Restaurant Selection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerSearchStep;
