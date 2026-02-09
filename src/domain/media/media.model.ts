//Importa el tipo base para los modelos del dominio
import type { BaseModel } from "../base/base.model";
//Define los tipos de media permitidos
export const MEDIA_TYPE_VALUES = ["image"] as const;
//Crea un tipo que representa los valores permitidos para el campo "type" en Media
export type MediaTypes = typeof MEDIA_TYPE_VALUES[number];
//Define los tipos de recursos relacionados permitidos para media, en este momento solo "products", luego puede ser extendido a otros tipos como "categories"
export const MEDIABLE_TYPE_VALUES = ["products"] as const;
//Crea un tipo que representa los valores permitidos para el campo "mediable_type" en Media
export type MediableTypes = typeof MEDIABLE_TYPE_VALUES[number];
//Define la interfaz Media que extiende del tipo base BaseModel, con los campos específicos para media
export interface Media extends BaseModel {
  url: string;
  order: number;
  type: MediaTypes;
  filename: string;
  mediable_type: MediableTypes;
  mediable_id: string;
}
