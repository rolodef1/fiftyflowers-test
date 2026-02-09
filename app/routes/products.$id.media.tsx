import { data, redirect } from "react-router";
import { Link, useFetcher, useLoaderData } from "react-router";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

import type { Product } from "../../src/domain/product/product.model";
import type { MEDIABLE_TYPE_VALUES, Media } from "../../src/domain/media/media.model";
import { mediaService, productService } from "../../src/composition/container.server";
import type { ReorderMediaDto } from "@/service/media/media.dto";

//Crea un tipo para los datos que devuelve el loader, en este caso un producto y sus medias asociadas.
type LoaderData = {
  product: Product;
  media: Media[];
};

// Define un valor constante para el tipo mediable, en este caso "products".
const MEDIABLE_TYPE: typeof MEDIABLE_TYPE_VALUES[number] = 'products';

// Define el loader para obtener el producto. Se ejecuta en el servidor antes de renderizar la página.
export async function loader({ params }: { params: { id: string } }) {
  const product = await productService.getProductById(params.id);
  const media = await mediaService.getAllMediaByMediableTypeAndMediableId(MEDIABLE_TYPE, params.id);
  return data<LoaderData>({ product, media });
}

// Define el action para upload, delete, reorder. Se ejecuta en el servidor al enviar el formulario.
export async function action({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  const form = await request.formData();
  //Obtiene el intent para saber qué acción realizar: upload, delete o reorder.
  const intent = String(form.get("intent") || "");

  if (intent === "upload") {
    const files = form.getAll("files").filter((f): f is File => f instanceof File);
    //Si el archivo tiene size 0 entonces lo descarta
    const validFiles = files.filter(file => file.size > 0);
    if (validFiles.length === 0) {
      return data({ ok: false, message: "No se recibieron archivos válidos." }, { status: 400 });
    }
    //Sube los archivos para el producto usando el mediaService y se encarga de crear los registros en la base de datos.
    await mediaService.uploadForMediable({
      mediable_type: MEDIABLE_TYPE,
      mediable_id: params.id,
      files: validFiles,
    });
    return redirect(`/products/${params.id}/media`);
  }

  if (intent === "reorder") {
    // Obtiene los datos de reorder desde el formData, que vienen como un string JSON
    const orderedDataStr = String(form.get("orderedData") || "{}");
    const orderedData: { id: Media['id'], dto: ReorderMediaDto } = JSON.parse(orderedDataStr);
    await mediaService.reorderMedia(orderedData.id, orderedData.dto);

    return redirect(`/products/${params.id}/media`);
  }

  if (intent === "delete") {
    // Obtiene el id del media a eliminar desde el formData
    const id = String(form.get("mediaId") || "");
    await mediaService.deleteMedia(id);
    return redirect(`/products/${params.id}/media`);
  }

  return data({ ok: true });
}

// Declara el componente de gestión de media del producto.
export default function ProductMediaPage() {
  // Obtiene el producto y su media cargados.
  const { product, media } = useLoaderData<typeof loader>() as LoaderData;

  // Estado local para reorder 
  const [items, setItems] = useState<Media[]>(() =>
    [...media].sort((a, b) => a.order - b.order)
  );

  useEffect(() => {
    setItems([...media].sort((a, b) => a.order - b.order));
  }, [media]);

  // Inicializa el fetcher para enviar el formulario.
  const fetcher = useFetcher();

  // Referencia al formulario de upload para resetearlo después de subir archivos.
  const uploadFormRef = useRef<HTMLFormElement>(null);
  // Bandera para saber si hay que resetear el formulario
  const shouldResetUploadFormRef = useRef(false);
  // Vigila el cambio de estado del fetcher para resetear el formulario después de una subida exitosa.
  useEffect(() => {
    if (fetcher.state === "idle" && shouldResetUploadFormRef.current) {
      uploadFormRef.current?.reset();
      shouldResetUploadFormRef.current = false;
    }
  }, [fetcher.state]);

  // Estado para el diálogo de confirmación de eliminación
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const itemToDelete = useMemo(
    () => items.find((m) => m.id === deleteId) ?? null,
    [items, deleteId]
  );

  const submitReorder = (id: Media['id'], dto: ReorderMediaDto) => {
    //Crea un formData, agrega los valores y envía el formulario con POST.
    const fd = new FormData();
    fd.append("intent", "reorder");
    fd.append("orderedData", JSON.stringify({ id, dto }));
    fetcher.submit(fd, { method: "post" });
  };

  // Función para mover un item en la lista de media hacia arriba o abajo.
  const move = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;

    const mediaToMove = items[index];
    // Simula un submit para reordenar
    submitReorder(mediaToMove.id, {
      mediable_type: mediaToMove.mediable_type,
      mediable_id: mediaToMove.mediable_id,
      order: newIndex,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Media</h1>
          <p className="text-sm text-muted-foreground">
            Producto: <span className="font-medium">{product.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/products">Volver</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to={`/products/${product.id}/edit`}>Editar producto</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subir imágenes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <fetcher.Form
            ref={uploadFormRef}
            method="post"
            encType="multipart/form-data"
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
            onSubmit={() => {
              shouldResetUploadFormRef.current = true;
            }}
          >
            <input type="hidden" name="intent" value="upload" />
            <div className="w-full">
              <Input name="files" type="file" accept="image/*" multiple />
              <p className="mt-2 text-xs text-muted-foreground">
                Puedes seleccionar varias imágenes.
              </p>
            </div>
            <Button className="mb-6" type="submit">Subir</Button>
          </fetcher.Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Catálogo</CardTitle>
        </CardHeader>

        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Este producto no tiene imágenes todavía.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((media, index) => (
                <div key={media.id} className="rounded-lg border overflow-hidden">
                  <div className="">
                    <img
                      src={media.url}
                      alt={media.filename}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-3 space-y-2">
                    <p className="text-sm font-medium truncate">{media.filename}</p>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => move(index, 1)}
                        disabled={index === items.length - 1}
                      >
                        ↓
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteId(media.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={itemToDelete !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar imagen</DialogTitle>
            <DialogDescription>
              ¿Seguro que deseas eliminar <b>{itemToDelete?.filename}</b>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setDeleteId(null)}>
              Cancelar
            </Button>

            <fetcher.Form method="post" onSubmit={() => setDeleteId(null)}>
              <input type="hidden" name="intent" value="delete" />
              <input type="hidden" name="mediaId" value={itemToDelete?.id ?? ""} />
              <Button type="submit" variant="destructive">
                Eliminar
              </Button>
            </fetcher.Form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
