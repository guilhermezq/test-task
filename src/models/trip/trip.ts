import { Route } from "../route/route.interface";

export class Trip {

    constructor(){}

    clone(trip: Trip){
        this.current = trip.current
        trip.routes.forEach(route => this.routes.push(route))
        trip.visitedAirports.forEach(airport => this.visitedAirports.push(airport))  
        this.distance = trip.distance
    }

    includeRoute(route: Route) {
        this.routes.push(route)
        this.current = route.arrival_airport_iata
        this.visitedAirports.push(route.arrival_airport_iata)
        this.distance = this.distance + route.distance
    }

    current: string
    routes: Route[] = []
    visitedAirports: any[] = []
    distance: number = 0
}
