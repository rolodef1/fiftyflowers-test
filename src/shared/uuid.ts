// Genera un ID único utilizando Math.random y toString(36)
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
}
