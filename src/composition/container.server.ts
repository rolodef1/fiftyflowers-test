import { ProductService } from "../service/product/product.service";
import { MediaService } from "../service/media/media.service";
import { ProductMemoryRepository } from "../persistence/product/product.memory.repository";
import { MediaMemoryRepository } from "../persistence/media/media.memory.repository";
import { LocalFileStorage } from "../storage/local-file-storage.server";

// Cargamos los repositorios necesarios que usará el frontend
const productRepository = new ProductMemoryRepository();
const mediaRepository = new MediaMemoryRepository();
// Cargamos servicios necesarios que usará el frontend y sus dependencias
export const fileStorage = new LocalFileStorage();
export const mediaService = new MediaService(mediaRepository, fileStorage);
export const productService = new ProductService(productRepository, mediaService);