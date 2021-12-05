import { Injectable } from '@nestjs/common';
import { timeStamp } from 'console';
import { min } from 'rxjs';
import { Route } from '../route/route.interface';
import { RouteService } from '../route/route.service';
import { Trip } from './trip';

@Injectable()
export class TripService {
  constructor(private routeService: RouteService) {}

  findTrip(destination: string, initialTrip: Trip, tripsByLegs = []): Trip {
    const minDistancesFromOrigin = {}
    const origin = initialTrip.visitedAirports[0]
    if(!this.routeService.airports.find(airport => airport.code === destination) ||
       !this.routeService.airports.find(airport => airport.code === initialTrip.visitedAirports[0])){
      throw new Error('invalid airport')
    }
    const MAX_LEGS = 4;
    let minDistance = Number.MAX_SAFE_INTEGER;
    let legs = 0;
    tripsByLegs[legs] = [initialTrip];
    const arrivedTrips: Trip[] = [];
    while (tripsByLegs[legs].length != 0) {
      tripsByLegs[legs]
        .filter((trip) => trip.current === destination)
        .forEach((trip) => {
          arrivedTrips.push(trip);
          minDistance = Math.min(minDistance, trip.distance);
        });
      legs = legs + 1;
      tripsByLegs[legs] = [];
      tripsByLegs[legs - 1]
        .filter((trip) => trip.current != destination)
        .filter((trip) => trip.distance < minDistance)
        .filter((trip) => this.toDest(trip, destination, minDistance))
        .filter((trip) => trip.routes.filter(route=>route.type === RouteType.AIR).length < MAX_LEGS)
        .forEach((trip) => {
        if(minDistancesFromOrigin[trip.current] < trip.distance){
          return;
        }
          this.routeService
            .getByOrigin(trip.current)
            .filter((route) => trip.distance + route.distance < minDistance)
            .filter((route) => !trip.visitedAirports.includes(route.arrival_airport_iata))
            .sort((route1, route2) => this.sortRoutes(route1,route2, origin, destination))
            .forEach((route) => {
              const nextLeg = new Trip();
              nextLeg.clone(trip);
              nextLeg.includeRoute(route);
              if(!minDistancesFromOrigin[route.arrival_airport_iata] || 
                 minDistancesFromOrigin[route.arrival_airport_iata] > nextLeg.distance ) {
                  tripsByLegs[legs].push(nextLeg)
                  minDistancesFromOrigin[route.arrival_airport_iata] = nextLeg.distance
                 };
            });
        });
    }
    return arrivedTrips.find(trip => trip.distance === minDistance);
  }

  sortRoutes(route1: Route, route2: Route, origin: string, destination: string) {
    if (route1.arrival_airport_iata === destination) {
      return -1;
    } else {
      return 0
    }
  }

  toDest(trip, destination, minDistance) {
    return (
      this.routeService.calculatBetweenAirportsNames(
        trip.current,
        destination,
      ) +
        trip.distance <
      minDistance
    );
  }
}
