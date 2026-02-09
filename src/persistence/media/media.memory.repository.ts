import type { Media } from "../../domain/media/media.model";
import type { CreateMediaDTO, UpdateMediaDto, ReorderMediaDto } from "../../service/media/media.dto";
import type { MediaRepository } from "./media.repository";
import { generateId } from "../../shared/uuid";

// Implementación en memoria del repositorio de medios, útil para pruebas y desarrollo sin necesidad de una base de datos real. Esta clase mantiene un array interno de objetos Media y proporciona métodos para crear, leer, actualizar, eliminar y reordenar medios según la interfaz definida en MediaRepository.
export class MediaMemoryRepository implements MediaRepository {
  private mediaItems: Media[] = [];

  // Crea un nuevo registro de media en la "base de datos" en memoria a partir de los datos proporcionados en el DTO de creación. Asigna un ID único, calcula el orden basado en la cantidad de medios existentes para el mismo recurso relacionado, y establece las fechas de creación y actualización.
  async create(data: CreateMediaDTO): Promise<Media> {
    // Calcula el orden basado en la cantidad de medios existentes para el mismo recurso relacionado
    const qtyExistingMedia = await this.countAllByMediableTypeAndMediableId(data.mediable_type, data.mediable_id);
    const newMedia: Media = {
      id: generateId(),
      order: qtyExistingMedia,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    this.mediaItems.push(newMedia);
    return newMedia;
  }

  async findById(id: Media["id"]): Promise<Media | null> {
    const media = this.mediaItems.find((m) => m.id === id);
    return media || null;
  }

  async findAllOrderByOrder(): Promise<Media[]> {
    return [...this.mediaItems].sort((a, b) => a.order - b.order);
  }

  async findAllByMediableTypeAndMediableIdOrderByOrder(mediable_type: Media["mediable_type"], mediable_id: Media["mediable_id"]): Promise<Media[]> {
    return this.mediaItems
      .filter((m) => m.mediable_type === mediable_type && m.mediable_id === mediable_id)
      .sort((a, b) => a.order - b.order);
  }

  async countAllByMediableTypeAndMediableId(mediable_type: Media["mediable_type"], mediable_id: Media["mediable_id"]): Promise<number> {
    return this.mediaItems.filter((m) => m.mediable_type === mediable_type && m.mediable_id === mediable_id).length;
  }

  async update(id: Media["id"], data: UpdateMediaDto): Promise<Media | null> {
    const mediaIndex = this.mediaItems.findIndex((m) => m.id === id);
    if (mediaIndex === -1) return null;

    const mediaToUpdate = this.mediaItems[mediaIndex];
    if (!mediaToUpdate) return null;

    const updatedMedia: Media = {
      ...mediaToUpdate,
      ...data,
      updatedAt: new Date(),
    };
    this.mediaItems[mediaIndex] = updatedMedia;
    return updatedMedia;
  }

  async delete(id: Media["id"]): Promise<boolean> {
    const mediaIndex = this.mediaItems.findIndex((m) => m.id === id);
    if (mediaIndex === -1) return false;

    this.mediaItems.splice(mediaIndex, 1);
    return true;
  }

  async reorder(id: Media["id"], data: ReorderMediaDto): Promise<boolean> {
    // Clona y orderna por el atributo order para mantener el orden actual
    const ordered = [...this.mediaItems].sort((a, b) => a.order - b.order);
    // Busca el índice del media por id
    const currentIndex = ordered.findIndex((m) => m.id === id);
    if (currentIndex === -1) return false;

    // Quita el elemento del orden actual
    const [mediaToMove] = ordered.splice(currentIndex, 1);
    if (!mediaToMove) return false;

    // Inserta el elemento en la nueva posición
    ordered.splice(data.order, 0, mediaToMove);
    // Obtiene la fecha actual para updatedAt
    const updatedAt = new Date();
    // Recalcula el array con nuevos valores de order y reemplaza el array original
    this.mediaItems = ordered.map((item, index) => ({
      ...item,
      order: index,
      updatedAt: updatedAt
    }));
    return true;
  }
}
