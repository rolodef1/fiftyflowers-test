import type { Product } from "../../domain/product/product.model";
// Define dto para la creación de un nuevo producto. Extiende de Product pero omite los campos que no son necesarios o que serán generados automáticamente (id, createdAt, updatedAt).
export interface CreateProductDTO extends Omit<Product, "id" | "createdAt" | "updatedAt"> {}
// Define dto para la actualización de un producto. Es similar a CreateProductDTO pero todos los campos son opcionales, ya que en una actualización no es necesario proporcionar todos los datos.
export interface UpdateProductDto extends Partial<CreateProductDTO> {}
// Crea un dto que representa los campos que pueden utilizarse en UI, pero excluyendo los campos que no son editables
export interface PreviewProductDTO extends Readonly<Omit<Product, "createdAt" | "updatedAt">> {
    imageUrl?: string | null; // Campo adicional para la URL de la imagen principal
}
// Crea un tipo que representa los campos que pueden utilizarse en UI, pero excluyendo los campos que no son editables
export type ProductUiFields = keyof Omit<Product, "id" | "createdAt" | "updatedAt">;

