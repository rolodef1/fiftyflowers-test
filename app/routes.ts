import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("products" ,"routes/products.tsx"),
    route("products/new", "routes/products.new.tsx"),
    //Estaclece ruta para edicion de producto
    route("products/:id/edit", "routes/products.$id.edit.tsx"),
    route("products/:id/media", "routes/products.$id.media.tsx"),
    
] satisfies RouteConfig;
