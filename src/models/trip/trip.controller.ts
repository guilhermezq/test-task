import { Controller, Get, Param } from '@nestjs/common';
import { Trip } from './trip';
import { TripService } from './trip.service';

@Controller('trip')
export class TripController {
  constructor(private tripService: TripService) {}

  @Get(':origin/:destination')
  getByDestination(@Param() param): string {
    const initialTrip = new Trip();
    initialTrip.current = param.origin;
    initialTrip.visitedAirports.push(param.origin);
    let result = param.origin;
    let trip;
    try {
      trip = this.tripService.findTrip(param.destination, initialTrip);
    } catch (e) {
      return e.message;
    }
    if (!trip) {
      return 'No route was found';
    }
    this.tripService
      .findTrip(param.destination, initialTrip)
      .routes.forEach((route) => {
        if (route.type === RouteType.AIR) {
          result = result + ` -> ${route.arrival_airport_iata}`;
        } else {
          result = result + ` => ${route.arrival_airport_iata}`;
        }
      });
    return result;
  }
}
