import api from "./axios";

export interface OrderItem {
  menuItemId: string;
  quantity: number;
}

export interface CreateOrderDto {
  items: OrderItem[];
}

export const createOrder = async (orderData: CreateOrderDto) => {
    const response = await api.post('/orders', orderData);
    return response.data;
};