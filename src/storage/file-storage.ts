// Define un tipo para representar un archivo almacenado, con su URL, nombre de archivo, tipo MIME y tamaño
export type StoredFile = {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
};

export interface FileStorage {
  // Guarda un archivo en una carpeta específica y devuelve información sobre el archivo almacenado
  save(input: { file: File; folder: string }): Promise<StoredFile>;
  // Elimina un archivo por su URL
  delete(input: { url: string }): Promise<void>;
}
