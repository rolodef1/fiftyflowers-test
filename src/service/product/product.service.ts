import type { Product } from "../../domain/product/product.model";
import type { ProductRepository } from "../../persistence/product/product.repository";
import type { CreateProductDTO, PreviewProductDTO, UpdateProductDto } from "./product.dto";
import { ValidationError, NotFoundError, hasFieldErrors } from "../../shared/errors";
import { validateCreateProductDTO, validateUpdateProductDTO } from "./product.validation";
import type { MediaService } from "../media/media.service";

export class ProductService {
  constructor(
    private readonly repository: ProductRepository,
    private readonly mediaService: MediaService // Inyecta el MediaService para obtener imágenes relacionadas
  ) {}

  async createProduct(dto: CreateProductDTO): Promise<Product> {
    const errors = validateCreateProductDTO(dto);
    if(hasFieldErrors(errors)) {
      throw new ValidationError("Error de validación al crear producto.", errors);
    }
    return this.repository.create(dto);
  }

  async getProductById(id: Product["id"]): Promise<Product> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundError(`Producto con id ${id} no encontrado.`);
    }
    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    return this.repository.findAll();
  }

  async getAllProductsWithMedia(): Promise<PreviewProductDTO[]> {
    const products = await this.repository.findAll();
    
    const result: PreviewProductDTO[] = [];

    products.forEach(async product => {
      const media = await this.mediaService.getAllMediaByMediableTypeAndMediableId('products', product.id);
      const preview: PreviewProductDTO = {
        ...product,
        imageUrl: media.length ? media[0].url : null
      };
      result.push(preview);
    });

    return result;
  }

  async updateProduct(id: Product["id"], dto: UpdateProductDto): Promise<Product> {
    const errors = validateUpdateProductDTO(dto);
    if(hasFieldErrors(errors)) {
      throw new ValidationError("Error de validación al actualizar producto.", errors);
    }
    const updatedProduct = await this.repository.update(id, dto);
    if (!updatedProduct) {
      throw new NotFoundError(`Producto con id ${id} no encontrado para actualizar.`);
    }
    return updatedProduct;
  }

  async deleteProduct(id: Product["id"]): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundError(`Producto con id ${id} no encontrado para eliminar.`);
    }
  }


}

