import type { Media, MediableTypes, MediaTypes } from "../../domain/media/media.model";
import type { MediaRepository } from "../../persistence/media/media.repository";
import type { CreateMediaDTO, UpdateMediaDto, ReorderMediaDto } from "./media.dto";
import { ValidationError, NotFoundError, hasFieldErrors } from "../../shared/errors";
import { validateCreateMediaDTO, validateUpdateMediaDTO, validateReorderMediaDTO } from "./media.validation";
import type { FileStorage } from "@/storage/file-storage";

export class MediaService {
  constructor(
    private readonly repository: MediaRepository,
    private readonly storage: FileStorage
  ) { }

  async createMedia(dto: CreateMediaDTO): Promise<Media> {
    const errors = validateCreateMediaDTO(dto);
    if (hasFieldErrors(errors)) {
      throw new ValidationError("Error de validación al crear media.", errors);
    }
    return this.repository.create(dto);
  }

  async getMediaById(id: Media["id"]): Promise<Media> {
    const media = await this.repository.findById(id);
    if (!media) {
      throw new NotFoundError(`Media con id ${id} no encontrado.`);
    }
    return media;
  }

  async getAllMedia(): Promise<Media[]> {
    return this.repository.findAllOrderByOrder();
  }

  async getAllMediaByMediableTypeAndMediableId(mediable_type: Media["mediable_type"], mediable_id: Media["mediable_id"]): Promise<Media[]> {
    return this.repository.findAllByMediableTypeAndMediableIdOrderByOrder(mediable_type, mediable_id);
  }

  async updateMedia(id: Media["id"], dto: UpdateMediaDto): Promise<Media> {
    const errors = validateUpdateMediaDTO(dto);
    if (hasFieldErrors(errors)) {
      throw new ValidationError("Error de validación al actualizar media.", errors);
    }
    const updatedMedia = await this.repository.update(id, dto);
    if (!updatedMedia) {
      throw new NotFoundError(`Media con id ${id} no encontrado para actualizar.`);
    }
    return updatedMedia;
  }

  async deleteMedia(id: Media["id"]): Promise<boolean> {
    const media = await this.repository.findById(id);
    if (!media) {
      throw new NotFoundError(`Media con id ${id} no encontrado para eliminar.`);
    }
    // Primero borra archivo
    await this.storage.delete({ url: media.url });
    // Luego borra datos
    const deleted = await this.repository.delete(id);
    return deleted;
  }

  async reorderMedia(id: Media["id"], dto: ReorderMediaDto): Promise<void> {
    const qtyExistingMedia = await this.repository.countAllByMediableTypeAndMediableId(dto.mediable_type, dto.mediable_id);
    if (qtyExistingMedia === 0) {
      throw new NotFoundError(`No se encontraron medios para el recurso relacionado ${dto.mediable_type} con id ${dto.mediable_id}.`);
    }
    const maxOrder = qtyExistingMedia - 1;
    const errors = validateReorderMediaDTO(dto, maxOrder);
    if (hasFieldErrors(errors)) {
      throw new ValidationError("Error de validación al reordenar media.", errors);
    }
    const reordered = await this.repository.reorder(id, dto);
    if (!reordered) {
      throw new NotFoundError(`Media con id ${id} no encontrado para reordenar.`);
    }
  }

  async uploadForMediable(input: {
    mediable_type: MediableTypes;
    mediable_id: string;
    files: File[];
  }): Promise<Media[]> {
    const { mediable_type, mediable_id, files } = input;

    const folder = `${mediable_type}/${mediable_id}`;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const stored = await this.storage.save({ file, folder });

      const mediaType = this.inferMediaType(file.type);

      const dto: CreateMediaDTO = {
        url: stored.url,
        filename: stored.filename,
        type: mediaType,
        mediable_type,
        mediable_id,
      };

      await this.repository.create(dto);
    }

    return this.repository.findAllByMediableTypeAndMediableIdOrderByOrder(mediable_type, mediable_id);
  }


  inferMediaType = (mimeType: string): MediaTypes => {
    if (mimeType.startsWith("image/")) return "image";
    // Agregar más tipos según sea necesario (video, audio, etc.)
    return "image";
  }
}