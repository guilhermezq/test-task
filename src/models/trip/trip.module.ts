import { Module } from '@nestjs/common';
import { RouteModule } from '../route/route.module';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';

@Module({
  imports: [RouteModule],
  controllers: [TripController],
  providers: [TripService]
})
export class TripModule {}
