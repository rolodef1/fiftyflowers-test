import type { Media } from "../../domain/media/media.model";

// Define el dto para crear un nuevo registro de media. Extiende de Media pero omite los campos que no son necesarios o que serán generados automáticamente (id, order, createdAt, updatedAt).
export interface CreateMediaDTO extends Omit<Media, "id" | "order" | "createdAt" | "updatedAt"> {}
// Define el dto para actualizar un registro de media. Es similar a CreateMediaDTO pero todos los campos son opcionales, ya que en una actualización no es necesario proporcionar todos los datos.
export interface UpdateMediaDto extends Partial<CreateMediaDTO> {}
// Define el dto para reordenar un registro de media. Solo incluye los campos necesarios para realizar el reordenamiento (order, mediable_type, mediable_id).
export interface ReorderMediaDto extends Pick<Media, "order" | "mediable_type" | "mediable_id"> {}
// Crea un tipo que representa los campos que pueden utilizarse en UI, pero excluyendo los campos que no son editables
export type MediaUiFields = keyof Omit<Media, "id" | "createdAt" | "updatedAt">
