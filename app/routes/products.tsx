import { data, redirect } from "react-router";
import { Link, useLoaderData, useFetcher } from "react-router";
import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

import { productService } from "../../src/composition/container.server";
import type { PreviewProductDTO } from "@/service/product/product.dto";

// Define el tipo de datos que devuelve el loader, en este caso una lista de productos con su media.
type LoaderData = { products: PreviewProductDTO[] };

// Define el loader para obtener los productos. Se ejecuta en el servidor antes de renderizar la página.
export async function loader() {
  const products = await productService.getAllProductsWithMedia();
  return data<LoaderData>({ products });
}

// Define el action para manejar acciones como eliminación. Se ejecuta en el servidor al enviar formularios.
export async function action({ request }: { request: Request }) {
  const form = await request.formData();
  // Obtiene el intent para saber qué acción se está intentando realizar
  const intent = String(form.get("intent") || "");

  if (intent === "delete") {
    const id = String(form.get("id") || "");
    await productService.deleteProduct(id);
    return redirect("/products");
  }

  return data({ ok: true });
}

// Declara el componente principal de la página de productos.
export default function ProductsPage() {
  // Obtiene los productos cargados por el loader.
  const { products } = useLoaderData<typeof loader>() as LoaderData;
  // Inicializa el fetcher para enviar formularios sin recargar la página.
  const fetcher = useFetcher();

  // Estado para el diálogo de confirmación de eliminación
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const productToDelete = useMemo(
    () => products.find((product) => product.id === deleteId) ?? null,
    [products, deleteId]
  );

  const isDeleting =
    fetcher.state === "submitting" &&
    fetcher.formData?.get("intent") === "delete" &&
    fetcher.formData?.get("id") === deleteId;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Productos</h1>
          <p className="text-sm text-muted-foreground">
            Administra tu catálogo de productos.
          </p>
        </div>

        <Button asChild>
          <Link to="/products/new">Crear producto</Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No hay productos todavía. Crea el primero.
            </p>
            <div className="mt-4">
              <Button asChild>
                <Link to="/products/new">Crear producto</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="h-full">
              <img
                src={product.imageUrl ?? "https://avatar.vercel.sh/shadcn1"}
                className="relative z-20 aspect-video w-full object-cover"
              />
              <CardHeader className="space-y-1">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground capitalize">
                  {product.category}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Precio: </span>
                    <span className="font-medium">${product.price.toFixed(2)}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Stock: </span>
                    <span className="font-medium">{product.stock_quantity}</span>
                  </p>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {product.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/products/${product.id}/edit`}>Editar</Link>
                  </Button>

                  <Button variant="secondary" size="sm" asChild>
                    <Link to={`/products/${product.id}/media`}>Administrar media</Link>
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteId(product.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={productToDelete !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar producto</DialogTitle>
            <DialogDescription>
              ¿Seguro que deseas eliminar <b>{productToDelete?.name}</b>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>

            <fetcher.Form method="post" onSubmit={() => setDeleteId(null)}>
              <input type="hidden" name="intent" value="delete" />
              <input type="hidden" name="id" value={productToDelete?.id ?? ""} />
              <Button type="submit" variant="destructive" disabled={isDeleting}>
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </Button>
            </fetcher.Form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
