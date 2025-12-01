import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { INVENTORY_SERVICE, PAYMENT_SERVICE } from '@app/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  private orders: any[] = [];

  constructor(
    @Inject(INVENTORY_SERVICE) private inventoryClient: ClientProxy,
    @Inject(PAYMENT_SERVICE) private paymentClient: ClientProxy,
  ) { }

  async createOrder(createOrderDto: CreateOrderDto) {
    const orderId = 'ORDER_' + Math.floor(Math.random() * 1000);
    const order = { ...createOrderDto, orderId, status: 'PENDING' };
    this.orders.push(order);
    console.log(`Order ${orderId} created. Status: PENDING`);

    try {
      // Step 1: Reserve Stock
      console.log(`Reserving stock for order ${orderId}...`);
      const stockResult = await lastValueFrom(
        this.inventoryClient.send('reserve_stock', {
          productId: createOrderDto.productId,
          quantity: createOrderDto.quantity,
          orderId,
        }),
      );

      if (!stockResult.success) {
        throw new Error('Stock reservation failed');
      }
      console.log(`Stock reserved for order ${orderId}`);

      // Step 2: Process Payment
      console.log(`Processing payment for order ${orderId}...`);
      const paymentResult = await lastValueFrom(
        this.paymentClient.send('process_payment', {
          orderId,
          amount: createOrderDto.price * createOrderDto.quantity,
        }),
      );

      if (!paymentResult.success) {
        // Compensation: Release Stock
        console.log(`Payment failed for order ${orderId}. Rolling back stock...`);
        this.inventoryClient.emit('release_stock', {
          productId: createOrderDto.productId,
          quantity: createOrderDto.quantity,
          orderId,
        });
        throw new Error('Payment failed');
      }

      // Success
      order.status = 'CONFIRMED';
      console.log(`Order ${orderId} CONFIRMED`);
      return order;
    } catch (error) {
      order.status = 'CANCELLED';
      console.log(`Order ${orderId} CANCELLED. Reason: ${error.message}`);
      return order;
    }
  }

  getOrders() {
    return this.orders;
  }
}
