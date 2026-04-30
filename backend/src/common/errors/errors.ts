import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseError extends HttpException {
  constructor(
    public readonly code: string,
    public readonly message: string,
    status: HttpStatus,
  ) {
    super({ code, message }, status);
  }
}

export class InsufficientBalanceError extends BaseError {
  constructor() {
    super(
      'INSUFFICIENT_BALANCE',
      'Insufficient wallet balance',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class AllergenConflictError extends BaseError {
  constructor(allergen: string) {
    super(
      'ALLERGEN_CONFLICT',
      `Item contains restricted allergen: ${allergen}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class ItemUnavailableError extends BaseError {
  constructor(itemName: string) {
    super(
      'ITEM_UNAVAILABLE',
      `The item "${itemName}" is currently unavailable`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class EntityNotFoundError extends BaseError {
  constructor(entityName: string, identifier: string | number) {
    super(
      'ENTITY_NOT_FOUND',
      `${entityName} with ID ${identifier} was not found`,
      HttpStatus.NOT_FOUND,
    );
  }
}

export class CannotCreateResourceError extends BaseError {
  constructor(reason: string = 'Could not complete the request') {
    super(
      'CREATE_FAILED',
      `Resource creation failed: ${reason}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
