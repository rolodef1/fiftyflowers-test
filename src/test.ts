//Hace una prueba de CRUD para Product y Media, aplica casos de uso para obtener resultados exitosos y tambien fallidos
import { ProductService } from "./service/product/product.service";
import { MediaService } from "./service/media/media.service";
import { ProductMemoryRepository } from "./persistence/product/product.memory.repository";
import { MediaMemoryRepository } from "./persistence/media/media.memory.repository";
import { LocalFileStorage } from "./storage/local-file-storage.server";

async function main() {
  const productRepository = new ProductMemoryRepository();
  const mediaRepository = new MediaMemoryRepository();
  const fileStorage = new LocalFileStorage();
  const mediaService = new MediaService(mediaRepository, fileStorage);
  const productService = new ProductService(productRepository, mediaService);

  // Prueba de CRUD para Product - Casos exitosos
  try {
    console.log("Creando producto...");
    const newProduct = await productService.createProduct({
      name: "Ramo de Rosas",
      price: 29.99,
      stock_quantity: 100,
      description: "Un hermoso ramo de rosas frescas.",
      category: "roses",
    });
    console.log("Producto creado:", newProduct);

    //Prueba Creacion de Media para el producto creado
    console.log("Creando media para el producto...");
    const newMedia = await mediaService.createMedia({
      url: "https://example.com/roses.jpg",
      type: "image",
      filename: "roses.jpg",
      mediable_type: "products",
      mediable_id: newProduct.id,
    });
    console.log("Media creada:", newMedia);

    //Prueba de obtener media por ID
    console.log("Obteniendo media por ID...");
    const fetchedMedia = await mediaService.getMediaById(newMedia.id);
    console.log("Media obtenida:", fetchedMedia);

    //Prueba de actualizar media
    console.log("Actualizando media...");
    const updatedMedia = await mediaService.updateMedia(newMedia.id, {
      url: "https://example.com/roses-updated.jpg",
      type: "image",
      mediable_type: "products",
      mediable_id: newProduct.id,
    });
    console.log("Media actualizada:", updatedMedia);

    //Crea otro medio para el mismo producto
    console.log("Creando otro medio para el mismo producto...");
    const anotherMedia = await mediaService.createMedia({
      url: "https://example.com/roses2.jpg",
      type: "image",
      filename: "roses2.jpg",
      mediable_type: "products",
      mediable_id: newProduct.id,
    });
    console.log("Otro medio creado:", anotherMedia);

    //Prueba de obtener todos los medios del producto
    console.log("Obteniendo todos los medios del producto...");
    const mediaForProduct = await mediaService.getAllMediaByMediableTypeAndMediableId("products", newProduct.id);
    console.log("Medios para el producto:", mediaForProduct);

    //Prueba de reordenar medios del producto
    console.log("Reordenando medios del producto...");
    await mediaService.reorderMedia(anotherMedia.id, {
      mediable_type: "products",
      mediable_id: newProduct.id,
      order: 0,
    });

    //Prueba de reordenar medios del producto - caso fallido (order fuera de rango)
    console.log("Reordenando medios del producto con orden inválido...");
    try {
      await mediaService.reorderMedia(anotherMedia.id, {
        mediable_type: "products",
        mediable_id: newProduct.id,
        order: 5, // Orden fuera de rango
      });
    } catch (error) {
      console.error("Error esperado al reordenar con orden inválido:", error);
    }

    //Prueba de reordenar medios del producto - caso fallido (no existen medios para el recurso relacionado)
    console.log("Reordenando medios de un recurso sin medios...");
    try {
      await mediaService.reorderMedia(anotherMedia.id, {
        mediable_type: "products",
        mediable_id: "nonexistent-product-id", // ID de producto inexistente
        order: 0,
      });
    } catch (error) {
      console.error("Error esperado al reordenar medios de un recurso sin medios:", error);
    }

    //Prueba de eliminar media
    console.log("Eliminando media...");
    await mediaService.deleteMedia(newMedia.id);
    console.log("Media eliminada.");

    //Prueba de obtener producto por id
    console.log("Obteniendo producto por ID...");
    const fetchedProduct = await productService.getProductById(newProduct.id);
    console.log("Producto obtenido:", fetchedProduct);

    //Prueba de actualizar producto
    console.log("Actualizando producto...");
    const updatedProduct = await productService.updateProduct(newProduct.id, {
      name: "Ramo de Rosas Rojas",
      price: 34.99,
      stock_quantity: 80,
      description: "Un hermoso ramo de rosas rojas frescas.",
      category: "roses",
    });
    console.log("Producto actualizado:", updatedProduct);

    //Prueba de eliminar producto
    console.log("Eliminando producto...");
    await productService.deleteProduct(newProduct.id);
    console.log("Producto eliminado.");

  } catch (error) {
    console.error("Error en operaciones de producto:", error);
  }
}

main().catch((error) => {
  console.error("Error en la ejecución principal:", error);
});
