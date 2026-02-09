import { data, redirect } from "react-router";
import { useLoaderData, useActionData, useFetcher } from "react-router";
import { Card } from "../components/ui/card";
import { ProductForm, type ProductFormValues } from "../ui/forms/product-form";
import { productService } from "../../src/composition/container.server";
import type { Categories, Product  } from "../../src/domain/product/product.model";
import type { ProductUiFields, UpdateProductDto } from "@/service/product/product.dto";
import { isValidationError, type FieldErrors } from "../../src/shared/errors";

//Crea un tipo para los datos que devuelve el loader, en este caso un producto.
type LoaderData = {
  product: Product;
};

//Crea un tipo para los datos que devuelve el action, en este caso errores de validación por campo.
type ActionData = {
  fieldErrors?: FieldErrors<ProductUiFields>
};

// Define el loader para obtener el producto. Se ejecuta en el servidor antes de renderizar la página.
export async function loader({ params }: { params: { id: string } }) {
  const product = await productService.getProductById(params.id);
  return data<LoaderData>({ product });
}

// Define el action para actualizar. Se ejecuta en el servidor al enviar el formulario.
export async function action({ request, params }: { request: Request; params: { id: string } }) {
  const form = await request.formData();

  // Construye el DTO con los valores del formulario.
  const dto: UpdateProductDto = {
    name: String(form.get("name") || ""),
    price: Number(form.get("price") || 0),
    stock_quantity: Number(form.get("stock_quantity") || 0),
    description: String(form.get("description") || ""),
    category: String(form.get("category") || "") as Categories
  };

  try {
    await productService.updateProduct(params.id, dto);
    return redirect("/products");
  } catch (err: unknown) {
    // Verifica si es un error de validación.
    if (isValidationError(err)) {
      return data<ActionData>({ fieldErrors: err.fieldErrors }, { status: 400 });
    }
    throw err;
  }
}

// Declara el componente de edición.
export default function EditProductPage() {
  // Obtiene el producto cargado.
  const { product } = useLoaderData<typeof loader>() as LoaderData;
  // Obtiene datos del action.
  const actionData = useActionData<typeof action>() as ActionData | undefined;
  // Inicializa el fetcher para enviar el formulario.
  const fetcher = useFetcher();
  // Define el handler de envío.
  const handleSubmit = (values: ProductFormValues) => {
    //Crea un formData, agrega los valores y envía el formulario con POST.
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, String(v)));
    fetcher.submit(fd, { method: "post" });
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card className="p-6 space-y-4">
        <h1 className="text-xl font-semibold">Editar producto</h1>

        <ProductForm
          defaultValues={product}
          onSubmit={handleSubmit}
          serverFieldErrors={actionData?.fieldErrors}
          submitLabel="Guardar cambios"
          disabled={fetcher.state === "submitting"}
        />
      </Card>
    </div>
  );
}
