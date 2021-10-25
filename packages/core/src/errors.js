export class ApplicationError extends Error {}

export class InitializationError extends ApplicationError {}

export class RendererError extends ApplicationError {}

export class InvalidPositionError extends ApplicationError {}

export class InvalidPropertyError extends ApplicationError {}

export class DriverError extends ApplicationError {}

export class StorageDriverError extends DriverError {}
export class StorageDriverAuthorizationError extends StorageDriverError {};
export class StorageDriverNotFoundError extends StorageDriverError {};
