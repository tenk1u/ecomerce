import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InventoryService } from './inventory.service';

@Controller()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) { }

  @MessagePattern('reserve_stock')
  reserveStock(@Payload() data: any) {
    return this.inventoryService.reserveStock(data);
  }

  @MessagePattern('release_stock')
  releaseStock(@Payload() data: any) {
    return this.inventoryService.releaseStock(data);
  }
}
