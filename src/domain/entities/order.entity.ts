// More info: https://docs.nestjs.com/techniques/serialization

import { Expose } from 'class-transformer';

export class OrderEntity {
  @Expose()
  id: number;

  @Expose()
  status: string;

  @Expose()
  clientId: number;
    
  products: any;
  
}
