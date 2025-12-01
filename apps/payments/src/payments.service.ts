import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  processPayment(data: any) {
    console.log('Processing payment for order', data.orderId);
    const success = Math.random() > 0.2; // 80% success rate
    if (success) {
      console.log('Payment successful');
      return { success: true };
    }
    console.log('Payment failed');
    return { success: false };
  }
}
