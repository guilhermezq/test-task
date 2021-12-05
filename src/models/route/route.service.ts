import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { AirRouteService } from './air-route/air-route.service';
import { GroundRouteService } from './ground-route/ground-route.service';
import { Route } from './route.interface';

@Injectable()
export class RouteService {
  routes: Route[] = [];
  airports: any[] = [];

  constructor(
    private groundRouteService: GroundRouteService,
    private airRouteService: AirRouteService,
  ) {
    this.airports = JSON.parse(
      fs.readFileSync(join(process.cwd(), 'json', 'airports.json'), 'utf-8'),
    );
  }

  onApplicationBootstrap() {
    this.groundRouteService.generateGroundRountes(100);
    this.airRouteService.generateAirRoutes();
  }

  getByDestination(destination: String): any[] {
    const filteredRoutes = this.routes.filter(
      (route) => route.arrival_airport_iata === destination,
    );
    return filteredRoutes;
  }

  getByOrigin(origin: String): Route[] {
    const filteredRoutes = this.routes.filter(
      (route) => route.departure_airport_iata === origin,
    );
    return filteredRoutes;
  }

  calculateRouteDistance(route: Route): number {
    const origin = route.departure_airport_iata;
    const destination = route.arrival_airport_iata;
    const originObject = this.airports.find(
      (airport) => airport.code === origin,
    );
    const destinationObject = this.airports.find(
      (airport) => airport.code === destination,
    );
    try {
      return this.getDistanceFromLatLonInKm(
        originObject.coordinates.lat,
        originObject.coordinates.lon,
        destinationObject.coordinates.lat,
        destinationObject.coordinates.lon,
      );
    } catch (e) {
      throw new Error();
    }
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  distanceBetweenAirports(airport1: any, airport2: any): number {
    return this.getDistanceFromLatLonInKm(
      airport1.coordinates.lat,
      airport1.coordinates.lon,
      airport2.coordinates.lat,
      airport2.coordinates.lon,
    );
  }

  calculatBetweenAirportsNames(airport1: string, airport2: string){
    const a1 = this.airports.find(airport => airport.code === airport1)
    const a2 = this.airports.find(airport => airport.code === airport2)
    return this.distanceBetweenAirports(a1, a2)
  }
}
