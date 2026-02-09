import { MEDIA_TYPE_VALUES, MEDIABLE_TYPE_VALUES } from "../../domain/media/media.model";
import type { CreateMediaDTO, UpdateMediaDto, ReorderMediaDto, MediaUiFields } from "./media.dto";
import type { FieldErrors } from "../../shared/errors";
import { isNonEmptyString, isNumber, isInOptions } from "../../shared/validations";


export function validateCreateMediaDTO(dto: CreateMediaDTO): FieldErrors<MediaUiFields> {
  const errors: FieldErrors<MediaUiFields> = {};

  // url: requerido
  if (!isNonEmptyString(dto.url)) {
    errors.url = "La URL es obligatoria.";
  }

  // type: requerido, una de las opciones definidas en MEDIA_TYPE_VALUES
  if (!isInOptions(dto.type, MEDIA_TYPE_VALUES)) {
    errors.type = "El tipo es obligatorio y debe ser válido.";
  }

  // mediable_type: requerido, una de las opciones definidas en MEDIABLE_TYPE_VALUES
  if (!isInOptions(dto.mediable_type, MEDIABLE_TYPE_VALUES)) {
    errors.mediable_type = "El tipo de recurso relacionado es obligatorio y debe ser válido.";
  }

  // mediable_id: requerido
  if (!isNonEmptyString(dto.mediable_id)) {
    errors.mediable_id = "El ID de recurso relacionado es obligatorio.";
  }

  return errors;
}

export function validateUpdateMediaDTO(dto: UpdateMediaDto): FieldErrors<MediaUiFields> {
  const errors: FieldErrors<MediaUiFields> = {};

  // url: requerido
  if (!isNonEmptyString(dto.url)) {
    errors.url = "La URL es obligatoria.";
  }

  // type: requerido, una de las opciones definidas en MEDIA_TYPE_VALUES
  if (!isInOptions(dto.type, MEDIA_TYPE_VALUES)) {
    errors.type = "El tipo es obligatorio y debe ser válido.";
  }

  // mediable_type: requerido, una de las opciones definidas en MEDIABLE_TYPE_VALUES
  if (!isInOptions(dto.mediable_type, MEDIABLE_TYPE_VALUES)) {
    errors.mediable_type = "El tipo de recurso relacionado es obligatorio y debe ser válido.";
  }

  // mediable_id: requerido
  if (!isNonEmptyString(dto.mediable_id)) {
    errors.mediable_id = "El ID de recurso relacionado es obligatorio.";
  }

  return errors;
}

export function validateReorderMediaDTO(dto: ReorderMediaDto, maxOrder: number): FieldErrors<MediaUiFields> {
  const errors: FieldErrors<MediaUiFields> = {};
  // order: Requerido, número, mínimo 0 y maximo maxOrder
  if (!isNumber(dto.order)) {
    errors.order = "El orden es obligatorio y debe ser un número.";
  } else if (dto.order < 0) {
    errors.order = "El orden no puede ser negativo.";
  } else if (dto.order > maxOrder) {
    errors.order = `El orden no puede ser mayor que ${maxOrder}.`;
  }
  return errors;
}
