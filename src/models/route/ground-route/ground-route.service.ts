import { ConsoleLogger, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Route } from '../route.interface';
import { RouteService } from '../route.service';

@Injectable()
export class GroundRouteService {
  constructor(
    @Inject(forwardRef(() => RouteService))
    private routeService: RouteService,
  ) {}

  groundRoutes: Route[] = [];

  generateGroundRountes(maximumDistance: number) {
    console.log('Ground Routes generation started');
    for (var i = 0; i < this.routeService.airports.length - 1; i++) {
      for (var j = i + 1; j < this.routeService.airports.length; j++) {
        const originAirport = this.routeService.airports[i];
        const destinationAirport = this.routeService.airports[j];
        const distance = this.routeService.getDistanceFromLatLonInKm(
          originAirport.coordinates.lat,
          originAirport.coordinates.lon,
          destinationAirport.coordinates.lat,
          destinationAirport.coordinates.lon,
        );
        if (distance < maximumDistance) {
          this.groundRoutes.push({
            departure_airport_iata: this.routeService.airports[i].code,
            arrival_airport_iata: this.routeService.airports[j].code,
            type: RouteType.GROUND,
            distance
          });
          this.groundRoutes.push({
            departure_airport_iata: this.routeService.airports[j].code,
            arrival_airport_iata: this.routeService.airports[i].code,
            type: RouteType.GROUND,
            distance
          });
        }
      }
    }
    this.groundRoutes.forEach(route => this.routeService.routes.push(route))
    console.log('Ground Routes generation finished');
  }
}
