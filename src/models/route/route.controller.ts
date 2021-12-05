import { Controller, Get, Param } from "@nestjs/common";
import { RouteService } from "./route.service";

@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}


  @Get(':origin')
  getByDestination(@Param() param): string {
    return JSON.stringify(this.routeService.getByDestination(param.origin))
  }
}