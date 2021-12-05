import { Module } from '@nestjs/common';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';
import { GroundRouteService } from './ground-route/ground-route.service';
import { AirRouteService } from './air-route/air-route.service';


@Module({
  controllers: [RouteController],
  providers: [RouteService,  GroundRouteService, AirRouteService],
  exports: [RouteService]
})
export class RouteModule {}