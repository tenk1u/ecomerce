import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Order {
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  status: string;
}

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(10);
  const [userId, setUserId] = useState('user1');

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 2000); // Poll every 2s
    return () => clearInterval(interval);
  }, []);

  const createOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/orders', {
        productId,
        quantity: Number(quantity),
        price: Number(price),
        userId,
      });
      alert('Order created!');
      fetchOrders();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order');
    }
  };

  return (
    <div className="container">
      <h1>E-commerce SAGA Demo</h1>

      <div className="card">
        <h2>Create Order</h2>
        <form onSubmit={createOrder}>
          <div className="form-group">
            <label>Product ID:</label>
            <input value={productId} onChange={(e) => setProductId(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Quantity:</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
          </div>
          <div className="form-group">
            <label>User ID:</label>
            <input value={userId} onChange={(e) => setUserId(e.target.value)} required />
          </div>
          <button type="submit">Place Order</button>
        </form>
      </div>

      <div className="card">
        <h2>Orders List</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId} className={order.status.toLowerCase()}>
                <td>{order.orderId}</td>
                <td>{order.productId}</td>
                <td>{order.quantity}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
