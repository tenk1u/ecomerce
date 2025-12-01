import { Injectable } from '@nestjs/common';

@Injectable()
export class InventoryService {
  private stock = 100; // Mock stock

  reserveStock(data: any) {
    console.log('Checking stock for product', data.productId);
    if (this.stock >= data.quantity) {
      this.stock -= data.quantity;
      console.log(`Stock reserved. Remaining: ${this.stock}`);
      return { success: true };
    }
    console.log('Insufficient stock');
    return { success: false };
  }

  releaseStock(data: any) {
    console.log('Releasing stock for product', data.productId);
    this.stock += data.quantity;
    console.log(`Stock released. Remaining: ${this.stock}`);
    return { success: true };
  }
}
