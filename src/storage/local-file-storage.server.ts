import fs from "node:fs/promises";
import path from "node:path";

import type { FileStorage, StoredFile } from "./file-storage";
import { generateId } from "../shared/uuid";

type LocalFileStorageOptions = {
  //Ruta absoluta al directorio "public" (por defecto: <root>/public)
  publicDir?: string;
  //Prefijo público para construir URLs (por defecto: "/uploads")
  publicBaseUrl?: string;
  //Subcarpeta dentro de public (por defecto: "uploads")
  uploadsDirName?: string;
};

export class LocalFileStorage implements FileStorage {
  private readonly publicDir: string;
  private readonly publicBaseUrl: string;
  private readonly uploadsDirName: string;

  constructor(options: LocalFileStorageOptions = {}) {
    this.publicDir = options.publicDir ?? path.join(process.cwd(), "public");
    this.publicBaseUrl = options.publicBaseUrl ?? "/uploads";
    this.uploadsDirName = options.uploadsDirName ?? "uploads";
  }

  async save(input: { file: File; folder: string }): Promise<StoredFile> {
    const { file } = input;
    const safeFolder = normalizeFolder(input.folder);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const originalName = typeof file.name === "string" ? file.name : "file";
    const ext = guessExtension(originalName, file.type);
    const safeBaseName = sanitizeBaseName(stripExtension(originalName));
    const unique = generateId();

    const filename = `${safeBaseName}-${unique}${ext}`;

    const absoluteFolderPath = path.join(
      this.publicDir,
      this.uploadsDirName,
      safeFolder
    );

    await fs.mkdir(absoluteFolderPath, { recursive: true });

    const absoluteFilePath = path.join(absoluteFolderPath, filename);
    await fs.writeFile(absoluteFilePath, buffer);

    const url = `${this.publicBaseUrl}/${safeFolder}/${filename}`.replace(
      /\/+/g,
      "/"
    );

    return {
      url,
      filename,
      mimeType: file.type || "application/octet-stream",
      size: buffer.length,
    };
  }

  async delete(input: { url: string }): Promise<void> {
    const url = input.url;

    // Solo se permite borrar cosas dentro de /uploads para evitar riesgo de path traversal
    if (!url.startsWith(this.publicBaseUrl + "/") && url !== this.publicBaseUrl) {
      return;
    }

    // Convierte URL pública a path en disco
    const relative = url.replace(this.publicBaseUrl, "").replace(/^\/+/, "");
    const absolutePath = path.join(this.publicDir, this.uploadsDirName, relative);

    try {
      await fs.unlink(absolutePath);
    } catch (err: unknown) {
      // Si el error es que el archivo no existe, simplemente ignoramos, porque el resultado final es que el archivo ya no está ahí, que es lo que queremos. Cualquier otro error sí lo lanzamos.
      if (err && typeof err === "object" && "code" in err && (err as NodeJS.ErrnoException).code === "ENOENT") {
        return;
      }
      throw err;
    }
  }
}

// Normaliza el nombre de la carpeta, eliminando espacios, caracteres peligrosos y bloqueando path traversal
function normalizeFolder(folder: string): string {
  const cleaned = folder
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .replace(/\/+/g, "/");

  if (cleaned.includes("..")) {
    throw new Error("Invalid folder path");
  }

  // Evita folder vacío
  return cleaned.length ? cleaned : "default";
}

// Sanitiza el nombre base del archivo, eliminando espacios, caracteres peligrosos y dejando solo letras, números, guiones, guiones bajos y puntos.
function sanitizeBaseName(name: string): string {
  const cleaned = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
  return cleaned.length ? cleaned : "file";
}

// Elimina la extensión del nombre de archivo
function stripExtension(filename: string): string {
  const idx = filename.lastIndexOf(".");
  return idx > 0 ? filename.slice(0, idx) : filename;
}

// Intenta adivinar la extensión del archivo a partir del nombre original y el mime type. Si el nombre ya tiene una extensión válida, la usa. Si no, hace un mapeo básico por mime type. Si no puede adivinar, devuelve cadena vacía.
function guessExtension(originalName: string, mimeType: string): string {
  const idx = originalName.lastIndexOf(".");
  if (idx > 0 && idx < originalName.length - 1) {
    const ext = originalName.slice(idx).toLowerCase();
    if (/^\.[a-z0-9]+$/.test(ext)) return ext;
  }

  // fallback por mimeType
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
  };

  return map[mimeType] ?? "";
}
