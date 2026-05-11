import api from "./axios";

export interface OrderItem {
  menuItemId: string;
  quantity: number;
}

export interface CreateOrderDto {
  studentId: string;
  items: OrderItem[];
}

export const createOrder = async (orderData: CreateOrderDto) => {
    const response = await api.post('/order', orderData);
    return response.data;
};

export const getAllOrders = async () => {
  const response = await api.get('/order/all');
  return response.data;
};