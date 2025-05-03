import { Request, Response } from 'express';


export function createDriverHandler(
  req: Request<{}, {}, DriverInputDto>,
  res: Response,
) {
  const errors = vehicleInputDtoValidation(req.body);

  if (errors.length > 0) {
    res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
    return;
  }

  const newDriver: Driver = {
    id: db.drivers.length ? db.drivers[db.drivers.length - 1].id + 1 : 1,
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    vehicleMake: req.body.vehicleMake,
    vehicleModel: req.body.vehicleModel,
    vehicleYear: req.body.vehicleYear,
    vehicleLicensePlate: req.body.vehicleLicensePlate,
    vehicleDescription: req.body.vehicleDescription,
    vehicleFeatures: req.body.vehicleFeatures,
    createdAt: new Date(),
  };

  db.drivers.push(newDriver);
  res.status(HttpStatus.Created).send(newDriver);
}