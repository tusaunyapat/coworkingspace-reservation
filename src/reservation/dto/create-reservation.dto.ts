export class CreateReservationDto {
  readonly user: string;
  readonly coworkingspaceId: string;
  readonly status: string; //reserved, checkin, cancel
  readonly date: string;
  readonly startTime: string;
  readonly endTime: string;
}
