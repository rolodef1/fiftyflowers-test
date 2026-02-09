import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Link } from "react-router";

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Administrador de Productos y Media</h1>
          <p className="text-muted-foreground">
            Aplicación CRUD desarrollada como prueba técnica para el rol de
            <strong> Senior Fullstack Developer</strong>.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Descripción del Proyecto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Este proyecto implementa un sistema completo de gestión de productos
              con administración de media. Incluye CRUD de productos, subida de archivos, previsualización, eliminación y
              reordenamiento de media.
            </p>
            <p>
              La administración de media está habilitada para imágenes por el momento, pero la arquitectura permite fácilmente agregar otros tipos de medios en el futuro. 
              Ademas se utiliza una relación polimórfica entre media y otros modelos, lo que permite asociar medios a diferentes tipos de recursos (productos, categorías, artículos, etc.) sin necesidad de crear tablas específicas para cada uno.
            </p>
            <p>
              Se aplicó una arquitectura limpia con separación por capas (Domain, Persistence, Service, Storage), 
              separando la lógica del negocio de la persistencia, almacenamiento y framework frontend, lo que permite una alta mantenibilidad y escalabilidad,
              logrando bajo acoplamiento y alta cohesión.
            </p>
            <div>
              <Button asChild>
                <Link to="/products">Ver administrador de Productos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funcionalidades Implementadas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li>CRUD completo de Productos</li>
              <li>Formulario validado con react-hook-form + Zod</li>
              <li>Gestión de Media por producto</li>
              <li>Upload múltiple de imágenes</li>
              <li>Previsualización de imágenes</li>
              <li>Eliminación con confirmación</li>
              <li>Reordenamiento de imágenes</li>
              <li>Primera imagen como preview del producto</li>
              <li>Arquitectura desacoplada (Model / Repository / DTO / Service / Storage)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stack Tecnológico</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge>Remix / React Router Framework</Badge>
            <Badge>TypeScript</Badge>
            <Badge>Tailwind CSS</Badge>
            <Badge>shadcn/ui</Badge>
            <Badge>react-hook-form</Badge>
            <Badge>Validación con Zod</Badge>
            <Badge>Arquitectura Hexagonal</Badge>
             <Badge>Persistencia en memoria</Badge>
            <Badge>Patrón Repository</Badge>
            <Badge>Almacenamiento de archivos local</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Desarrollador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Nombre:</strong> Rodrigo Isaac Carrera Estrada</p>
            <p><strong>Rol:</strong> Senior Fullstack Developer</p>
            <p>
              Senior Full-Stack Developer & Emprendedor Digital 🚀 Desde 2012 construyendo productos, startups y soluciones a medida. Stack: PHP · JavaScript · Java · Etc.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p><strong>Email:</strong> <a href="mailto:isaaccarreraestrada@gmail.com" className="text-blue-600 hover:underline">isaaccarreraestrada@gmail.com</a></p>
            <p><strong>Teléfono:</strong> <a href="tel:+593995253477" className="text-blue-600 hover:underline">+593 995253477</a></p>
            <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/rodrigo-isaac-carrera-estrada/" target="_blank" className="text-blue-600 hover:underline">https://www.linkedin.com/in/rodrigo-isaac-carrera-estrada/</a></p>
          </CardContent>
        </Card>

        <Separator />

        <div className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} — Implementación de Prueba Técnica por Rodrigo Isaac Carrera Estrada
        </div>

      </div>
    </div>
  );
}
