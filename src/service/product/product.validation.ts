import { CATEGORY_VALUES } from "../../domain/product/product.model";
import type { CreateProductDTO, UpdateProductDto, ProductUiFields } from "./product.dto";
import type { FieldErrors } from "../../shared/errors";
import { isNonEmptyString, isNumber, isInOptions } from "../../shared/validations";

export function validateCreateProductDTO(dto: CreateProductDTO): FieldErrors<ProductUiFields> {
  const errors: FieldErrors<ProductUiFields> = {};

  // name: Requerido mínimo 3 caracteres
  if (!isNonEmptyString(dto.name)) {
    errors.name = "El nombre es obligatorio.";
  } else if (dto.name.trim().length < 3) {
    errors.name = "El nombre debe tener al menos 3 caracteres.";
  }

  // price: requerido, número, mínimo 0.01
  if (!isNumber(dto.price)) {
    errors.price = "El precio es obligatorio y debe ser un número.";
  } else if (dto.price < 0.01) {
    errors.price = "El precio debe ser al menos 0.01.";
  }

  // stock_quantity: requerido, número, mínimo 0
  if (!isNumber(dto.stock_quantity)) {
    errors.stock_quantity = "El stock es obligatorio y debe ser un número.";
  } else if (dto.stock_quantity < 0) {
    errors.stock_quantity = "El stock no puede ser negativo.";
  }

  // description: requerido, mínimo 10, máximo 200
  if (!isNonEmptyString(dto.description)) {
    errors.description = "La descripción es obligatoria.";
  } else {
    const len = dto.description.trim().length;
    if (len < 10) errors.description = "La descripción debe tener al menos 10 caracteres.";
    if (len > 200) errors.description = "La descripción no puede exceder 200 caracteres.";
  }

  // category: requerido, una de las opciones definidas en CATEGORY_VALUES
  if (!isInOptions(dto.category, CATEGORY_VALUES)) {
    errors.category = "La categoría es obligatoria y debe ser válida.";
  }

  return errors;
}

export function validateUpdateProductDTO(dto: UpdateProductDto): FieldErrors<ProductUiFields> {
  // UpdateProductDTO contiene los mismos campos, así que reutilizamos
  return validateCreateProductDTO(dto as CreateProductDTO);
}
