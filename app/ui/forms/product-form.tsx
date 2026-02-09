import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import { CATEGORY_VALUES } from "../../../src/domain/product/product.model";
import type {
  ProductUiFields,
} from "../../../src/service/product/product.dto";
import type { FieldErrors } from "../../../src/shared/errors";

// Esquema de validación con Zod, que también se usa en el servidor para validar el DTO.
const productSchema = z.object({
  name: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres."),
  price: z.number().min(0.01, "El precio debe ser mínimo 0.01."),
  stock_quantity: z.number().min(0, "El stock no puede ser negativo."),
  description: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres.")
    .max(200, "La descripción no puede exceder 200 caracteres."),
  category: z.enum(CATEGORY_VALUES, {
    message: "Selecciona una categoría válida.",
  }),
});

//Crea un tipo a partir del esquema para usarlo en el form y en el onSubmit.
export type ProductFormValues = z.infer<typeof productSchema>;

type Props = {
  // Valores iniciales para el formulario de edición. Es opcional porque para creación no se necesitan.
  defaultValues?: Partial<ProductFormValues>;
  // Errores de validación por campo que vienen del servidor. El form los mapea a los campos correspondientes para mostrarlos en la UI.
  serverFieldErrors?: FieldErrors<ProductUiFields>;
  // Etiqueta del boton
  submitLabel?: string;
  // Deshabilitar botón
  disabled?: boolean;
  // Funcion que se llama al enviar el form
  onSubmit: (values: ProductFormValues) => void;
};

// Componente de formulario reutilizable para creación y edición de productos.
export function ProductForm({
  defaultValues,
  serverFieldErrors,
  submitLabel = "Guardar",
  disabled = false,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    watch,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0.01,
      stock_quantity: 0,
      description: "",
      category: "roses",
      ...defaultValues,
    },
    mode: "onBlur",
  });

  // Si el server devuelve errores por campo, los mapeamos al form
  useEffect(() => {
    if (!serverFieldErrors) return;

    (Object.keys(serverFieldErrors) as ProductUiFields[]).forEach((key) => {
      const message = serverFieldErrors[key];
      if (message) {
        setError(key as keyof ProductFormValues, { type: "server", message });
      }
    });
  }, [serverFieldErrors, setError]);

  // Para el select controlado, obtenemos el valor actual para mostrarlo en el trigger
  const categoryValue = watch("category") ?? CATEGORY_VALUES[0];

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit((values) => onSubmit(values))}
    >
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          placeholder="Ej: Bouquet Primavera"
          {...register("name")}
        />
        {errors.name?.message ? (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Precio</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0.01"
          {...register("price", { valueAsNumber: true })}
        />
        {errors.price?.message ? (
          <p className="text-sm text-red-600">{errors.price.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock_quantity">Stock</Label>
        <Input
          id="stock_quantity"
          type="number"
          step="1"
          min="0"
          {...register("stock_quantity", { valueAsNumber: true })}
        />
        {errors.stock_quantity?.message ? (
          <p className="text-sm text-red-600">{errors.stock_quantity.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          placeholder="Describe el producto (10–200 caracteres)"
          rows={4}
          {...register("description")}
        />
        <div className="flex items-center justify-between">
          {errors.description?.message ? (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          ) : (
            <span />
          )}
          <p className="text-xs text-muted-foreground">
            {(watch("description")?.length ?? 0)}/200
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Categoría</Label>

        <Select
          value={categoryValue}
          onValueChange={(v) => setValue("category", v as typeof CATEGORY_VALUES[number], { shouldValidate: true })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_VALUES.map((c) => (
              <SelectItem key={c} value={c}>
                {c.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.category?.message ? (
          <p className="text-sm text-red-600">{errors.category.message}</p>
        ) : null}
      </div>

      <Button type="submit" disabled={disabled || isSubmitting} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
