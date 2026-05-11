/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Button } from '../@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '../@/components/ui/popover';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '../@/components/ui/command';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../@/components/ui/card';
import { getAllMenuItems, getAllStudents } from './services/axios';
import { Check, ChevronsUpDown, Plus, Minus, ShoppingCart } from "lucide-react";
import { cn } from '../@/lib/utils';

function App() {

  const [students, setStudents] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [selectedStudent, setSelectedStudent] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Fetch both datasets concurrently
        const [studentRes, menuRes] = await Promise.all([
          getAllStudents(),
          getAllMenuItems(),
        ]);

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
  }, []);

  if (loading) return <div>Loading Canteen...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

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

  const handlePlaceOrder = () => {}
  
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

      {/* Place Order Bar */}
      {Object.keys(cart).length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md">
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
