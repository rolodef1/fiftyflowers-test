// Crea un tipo generico para los errores de validación, donde las claves son los campos de la UI y los valores son mensajes de error
export type FieldErrors<TFields extends string> = Partial<Record<TFields, string>>;

// Define una clase de error personalizada para errores de validación, que extiende de Error y tiene un campo adicional para los errores por campo
export class ValidationError<TFields extends string> extends Error {
  constructor(
    message = "Validation failed",
    public readonly fieldErrors: FieldErrors<TFields>
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

// Define una clase de error personalizada para errores de "no encontrado", que extiende de Error
export class NotFoundError extends Error {
  constructor(message = "Not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

// Función de tipo guard para verificar si un error es una instancia de ValidationError
export const isValidationError = (err: unknown): err is ValidationError<string> => {
  return err instanceof ValidationError;
}

// Función para verificar si hay errores de campo presentes
export const hasFieldErrors = <T extends string>(errors: Partial<Record<T, string>>): boolean =>
  Object.keys(errors).length > 0;
