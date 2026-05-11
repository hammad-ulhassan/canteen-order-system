/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '../@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '../@/components/ui/popover';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '../@/components/ui/command';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../@/components/ui/table';
import { getAllMenuItems, getAllStudents } from './services/axios';
import { Check, ChevronsUpDown, Plus, Minus, ShoppingCart } from "lucide-react";
import { cn } from '../@/lib/utils';
import { createOrder, CreateOrderDto, getAllOrders, OrderItem } from './services/order.service';

function App() {

  const [students, setStudents] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [selectedStudent, setSelectedStudent] = useState("");
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  const menuLookup = useMemo(() => {
    return Object.fromEntries(menuItems.map(item => [item.id, item.price]));
  }, [menuItems]);
  
  const totalAmount = useMemo(() => {
    return Object.entries(cart).reduce((sum, [itemId, quantity]) => {
      const price = menuLookup[itemId] || 0;
      return sum + (price * quantity);
    }, 0);
  }, [cart, menuLookup]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await getAllOrders();
      if(res.statusCode === 200) {
        setOrders(res.data[0] || []);
      }else{
        alert("Error fetching Orders");
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [studentRes, menuRes] = await Promise.all([
          getAllStudents(),
          getAllMenuItems(),
        ]);
        fetchOrders();

        console.log({studentRes, menuRes})
        setStudents(studentRes.data[0]); 
        setMenuItems(menuRes.data[0]);
      } catch (err) {
        setError("Failed to load canteen data. Please try again later.");
        console.error("Canteen Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchOrders]);

  const handlePlaceOrder = useCallback(async () => {
    if (!selectedStudent) {
      alert("Please select a student first!");
      return;
    }
  
    const orderItems: OrderItem[] = Object.entries(cart).map(([menuItemId, quantity]) => ({
      menuItemId,
      quantity,
    }));
  
    const payload: CreateOrderDto = {
      studentId: selectedStudent,
      items: orderItems,
    };
  
    try {
      setLoading(true);
      console.log({payload});
      const result = await createOrder(payload);
      
      console.log(result);
      const {statusCode} = result;
      if(statusCode === 200) {
        setCart({});
        setSelectedStudent("");
        alert("Order placed successfully!");
        await fetchOrders();
      } else {
        const { data: { message } } = result;
        alert(`Order Placement error: ${ message }`);
        console.error("Order placement failed");
      }
    } catch (err: any) {
      console.error("Order failed:", err);
      const errorMsg = err.response?.data?.message || "Something went wrong";
      alert(`Failed to place order: ${Array.isArray(errorMsg) ? errorMsg.join(", ") : errorMsg}`);
    } finally {
      setLoading(false);
    }
  }, [selectedStudent, cart, fetchOrders]);


  if (loading) return <div className="flex h-screen items-center justify-center font-medium">Loading Canteen System...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-destructive font-bold">{error}</div>;

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const newQty = (prev[id] || 0) + delta;
      if (newQty <= 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newQty };
    });
  };  
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Canteen POS</h1>
        
        {/* Student Selection (Shadcn Combobox) */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[300px] justify-between">
              {selectedStudent 
                ? students.find(s => s.id === selectedStudent)?.name 
                : "Select student..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search student..." />
              <CommandEmpty>No student found.</CommandEmpty>
              <CommandGroup>
                {students.map((student) => (
                  <CommandItem
                    key={student.id}
                    onSelect={() => {
                      setSelectedStudent(student.id);
                      setOpen(false);
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", selectedStudent === student.id ? "opacity-100" : "opacity-0")} />
                    {student.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Card key={item.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-lg">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${item.price}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t pt-4">
              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, -1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{cart[item.id] || 0}</span>
                <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <aside className="space-y-4">
            <h2 className="text-xl font-bold px-1">Order History</h2>
            <Card className="h-full border-none shadow-md overflow-hidden">
              <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
                <Table>
                  <TableHeader className="bg-muted/50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="w-[60%]">Customer</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-20 text-muted-foreground italic">
                          No recent transactions
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-muted/30">
                          <TableCell className="py-3">
                            <div className="font-semibold text-sm truncate w-[140px]">
                              {order.student?.name || "Deleted Student"}
                            </div>
                          </TableCell>
                          <TableCell className="text-right align-top pt-3">
                            <span className="font-mono font-bold text-green-600">
                              ${Number(order.total || order.totalAmount).toFixed(2)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </aside>

      {/* Place Order Bar */}
      {Object.keys(cart).length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md">
          <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground font-medium">Order Total</span>
              <span className="text-2xl font-bold text-primary">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          <Button className="w-full h-14 text-lg shadow-2xl" onClick={handlePlaceOrder}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Place Order ({Object.values(cart).reduce((a, b) => a + b, 0)} items)
          </Button>
        </div>
      )}
    </div>
  );
}

export default App
