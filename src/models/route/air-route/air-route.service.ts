import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Route } from '../route.interface';
import { RouteService } from '../route.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class AirRouteService {
  airRoutes: Route[] = [];

  constructor(
    @Inject(forwardRef(() => RouteService))
    private routeService: RouteService,
  ) {}

  generateAirRoutes() {
    console.log("Air Routes generation started")
    this.airRoutes = JSON.parse(
      fs.readFileSync(join(process.cwd(), 'json', 'routes.json'), 'utf-8'),
    );
    this.airRoutes.forEach((route) => {
      try {
        route.distance = this.routeService.calculateRouteDistance(route);
      } catch (e) {
        route.distance = -1;
      }
      route.type = RouteType.AIR;
    });
    this.airRoutes
    .filter(route => route.distance > 0)
    .forEach(route => this.routeService.routes.push(route))
    console.log("Air Routes generation finished")
  }
}
