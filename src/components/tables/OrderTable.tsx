import React, { useState } from "react";
import { ProductOrderResponseDto, UpdateProductOrderDto } from "@/types/order";
import { OrderStatus } from "@/types/enum";

interface OrdersTableProps {
  orders: ProductOrderResponseDto[];
  onUpdate: (data: UpdateProductOrderDto & { id: number }) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onUpdate }) => {
  const [selectedOrder, setSelectedOrder] = useState<UpdateProductOrderDto & { id: number } | null>(null);

  const handleUpdate = (order: ProductOrderResponseDto) => {
    const updateData: UpdateProductOrderDto & { id: number } = {
      id: order.id,
      status: order.status as OrderStatus,
    };
    setSelectedOrder(updateData);
    onUpdate(updateData);
  };

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Buyer</th>
          <th>Total Price</th>
          <th>Status</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.buyer?.firstName} {order.buyer?.lastName}</td>
            <td>{order.totalPrice}</td>
            <td>{order.status}</td>
            <td>{order.createdAt}</td>
            <td>
              <button onClick={() => handleUpdate(order)}>Update</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrdersTable;
