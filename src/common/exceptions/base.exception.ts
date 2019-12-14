import { HttpStatus } from "@nestjs/common";

export class BaseException extends Error {
  public status: HttpStatus;

  public constructor(errMessage, status = HttpStatus.BAD_REQUEST) {
    super(errMessage);
    this.status = status
  }
}