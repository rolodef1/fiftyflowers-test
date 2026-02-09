// Funciones de validación genéricas para diferentes tipos de datos
export const isInOptions = <T extends string>(
  value: unknown,
  options: ReadonlyArray<T>
): value is T => {
  return typeof value === "string" && (options as ReadonlyArray<string>).includes(value);
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === "number" && Number.isFinite(value);
};

export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.trim().length > 0;
};
