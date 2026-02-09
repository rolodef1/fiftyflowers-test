import { data, redirect } from "react-router";
import { useActionData, useFetcher } from "react-router";
import { Card } from "../components/ui/card";
import { ProductForm, type ProductFormValues } from "../ui/forms/product-form";
import { productService } from "../../src/composition/container.server";
import type { ProductUiFields, CreateProductDTO } from "@/service/product/product.dto";
import type { Categories } from "../../src/domain/product/product.model";
import { isValidationError, type FieldErrors } from "../../src/shared/errors";

//Crea un tipo para los datos que devuelve el action, en este caso errores de validación por campo.
type ActionData = {
  fieldErrors?: FieldErrors<ProductUiFields>
};

// Define el action para crear el producto. Se ejecuta en el servidor al enviar el formulario.
export async function action({ request }: { request: Request }) {
  const form = await request.formData();

  // Construye el DTO con los valores del formulario.
  const dto: CreateProductDTO = {
    name: String(form.get("name") || ""),
    price: Number(form.get("price") || 0),
    stock_quantity: Number(form.get("stock_quantity") || 0),
    description: String(form.get("description") || ""),
    category: String(form.get("category") || "") as Categories,
  };

  try {
    await productService.createProduct(dto);
    return redirect("/products");
  } catch (err: unknown) {
    if (isValidationError(err)) {
      return data<ActionData>({ fieldErrors: err.fieldErrors }, { status: 400 });
    }
    throw err;
  }
}

// Declara el componente de nuevo producto.
export default function NewProductPage() {
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
        <h1 className="text-xl font-semibold">Crear producto</h1>

        <ProductForm
          onSubmit={handleSubmit}
          serverFieldErrors={actionData?.fieldErrors}
          submitLabel="Crear"
          disabled={fetcher.state === "submitting"}
        />
      </Card>
    </div>
  );
}
