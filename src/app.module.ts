import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouteModule } from './models/route/route.module';
import { TripModule } from './models/trip/trip.module';

@Module({
  imports: [RouteModule, TripModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
