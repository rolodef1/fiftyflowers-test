import type { Product } from "../../domain/product/product.model";

import type { CreateProductDTO, UpdateProductDto } from "../../service/product/product.dto";

// Define la interfaz del repositorio de productos. Es un contrato que cualquier implementación de repositorio debe cumplir. Esto permite cambiar la implementación (por ejemplo, de memoria a base de datos) sin afectar el resto de la aplicación.
export interface ProductRepository {
  create(data: CreateProductDTO): Promise<Product>;
  findById(id: Product["id"]): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  update(id: Product["id"], data: UpdateProductDto): Promise<Product | null>;
  delete(id: Product["id"]): Promise<boolean>;
}
