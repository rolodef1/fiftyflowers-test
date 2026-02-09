import type { Media } from "../../domain/media/media.model";
import type { CreateMediaDTO, UpdateMediaDto, ReorderMediaDto } from "../../service/media/media.dto";

// Define la interfaz del repositorio de medios, que establece los métodos que cualquier implementación de repositorio de medios debe tener. Esto permite una abstracción entre la lógica de negocio y la capa de persistencia, facilitando el mantenimiento y la escalabilidad del código.
export interface MediaRepository {
  // Crea un nuevo registro de media en la base de datos a partir de los datos proporcionados en el DTO de creación. Devuelve una promesa que resuelve con el objeto Media creado.
  create(data: CreateMediaDTO): Promise<Media>;
  // Busca un registro de media por su ID. Devuelve una promesa que resuelve con el objeto Media encontrado o null si no se encuentra ningún registro con ese ID.
  findById(id: Media["id"]): Promise<Media | null>;
  // Devuelve una lista de todos los registros de media ordenados por el campo "order". Esto es útil para mostrar los medios en un orden específico en la interfaz de usuario.
  findAllOrderByOrder(): Promise<Media[]>;
  // Devuelve una lista de todos los registros de media que coinciden con un tipo y ID de recurso relacionado específicos, ordenados por el campo "order". Esto permite obtener los medios asociados a un recurso específico, como un producto.
  findAllByMediableTypeAndMediableIdOrderByOrder(mediable_type: Media["mediable_type"], mediable_id: Media["mediable_id"]): Promise<Media[]>;
  // Cuenta la cantidad de registros de media que coinciden con un tipo y ID de recurso relacionado específicos. Esto es útil para validar la existencia de medios asociados a un recurso antes de realizar operaciones como reordenar.
  countAllByMediableTypeAndMediableId(mediable_type: Media["mediable_type"], mediable_id: Media["mediable_id"]): Promise<number>;
  // Actualiza un registro de media existente identificado por su ID con los datos proporcionados en el DTO de actualización. Devuelve una promesa que resuelve con el objeto Media actualizado o null si no se encuentra ningún registro con ese ID para actualizar.
  update(id: Media["id"], data: UpdateMediaDto): Promise<Media | null>;
  // Elimina un registro de media identificado por su ID. Devuelve una promesa que resuelve con un booleano indicando si la eliminación fue exitosa (true) o si no se encontró ningún registro con ese ID para eliminar (false).
  delete(id: Media["id"]): Promise<boolean>;
  // Reordena un registro de media identificado por su ID según los datos proporcionados en el DTO de reordenamiento. Devuelve una promesa que resuelve con un booleano indicando si el reordenamiento fue exitoso (true) o si no se encontró ningún registro con ese ID para reordenar (false).
  reorder(id: Media["id"], data: ReorderMediaDto): Promise<boolean>;

}
