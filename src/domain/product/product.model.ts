//Importa el tipo base para los modelos del dominio
import type { BaseModel } from "../base/base.model";

//Define lista de categorías como un array de strings constantes, lo que permite una validación más sencilla y evita errores tipográficos
export const CATEGORY_VALUES = ["roses", "tulips", "lilies", "mixed"] as const;

// Crea un tipo de unión a partir de los valores del array, lo que garantiza que solo se puedan usar esas opciones como categorías
export type Categories = typeof CATEGORY_VALUES[number];

//Define la interfaz Product que extiende del tipo base BaseModel, con los campos específicos para un producto
export interface Product extends BaseModel {
  name: string;
  price: number;
  stock_quantity: number;
  description: string;
  category: Categories;
}
