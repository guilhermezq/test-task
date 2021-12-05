export interface Route {
    departure_airport_iata: string;
    arrival_airport_iata: string;
    type?: RouteType;
    distance?;
}