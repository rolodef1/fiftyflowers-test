import type { Product } from "../../domain/product/product.model";
import type { CreateProductDTO, UpdateProductDto } from "../../service/product/product.dto";
import type { ProductRepository } from "./product.repository";
import { generateId } from "../../shared/uuid";

export class ProductMemoryRepository implements ProductRepository {
  private products: Product[] = [];

  async create(data: CreateProductDTO): Promise<Product> {
    const newProduct: Product = {
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async findById(id: Product["id"]): Promise<Product | null> {
    const product = this.products.find((p) => p.id === id);
    return product || null;
  }

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  async update(id: Product["id"], data: UpdateProductDto): Promise<Product | null> {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) return null;
    const productToUpdate = this.products[productIndex];
    if (!productToUpdate) return null;
    const updatedProduct: Product = {
      ...productToUpdate,
      ...data,
      updatedAt: new Date(),
    };
    this.products[productIndex] = updatedProduct;
    return updatedProduct;
  }

  async delete(id: Product["id"]): Promise<boolean> {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) return false;
    this.products.splice(productIndex, 1);
    return true;
  }
}
