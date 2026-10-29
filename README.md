# ClaroTestApp - Frontend

Aplicacion web cliente desarrollada en Angular 20 que consume la API proxy en .NET para la gestion de libros y autores conectada a FakeRestAPI. Implementa arquitectura modular orientada a dominios con enrutamiento perezoso (Lazy Loading) y reactividad basada en Signals.

---

## Requisitos Previos

* **Node.js:** Version 20.19.0 o superior (recomendado LTS v22).
* **NPM:** Version 10.0 o superior.
* **Angular CLI:** Version 20.x (opcional si se ejecutan scripts mediante npm).
* **Backend Activo:** El servicio `ClaroTestBackend.API` debe estar ejecutandose (por defecto en `https://localhost:7054` o `http://localhost:5228`).

---

## Configuracion del Entorno

La URL del backend en .NET se encuentra configurada en el archivo `src/environments/environment.ts`:

```typescript
export const environment = {
  apiUrl: 'https://localhost:7054/api'
};
```

> **Nota:** Si ejecutas el backend exclusivamente bajo HTTP simple sin SSL, actualiza la propiedad a `http://localhost:5228/api`.

---

## Instalacion y Ejecucion

### 1. Clonar e instalar dependencias

Desde una terminal en la raiz del proyecto frontend:

```bash
npm install
```

### 2. Iniciar el servidor de desarrollo

```bash
npm start
```
*(O de manera directa: `ng serve`)*

### 3. Acceder a la aplicacion

Abre tu navegador e ingresa a:
```text
http://localhost:4200/
```

---

## Arquitectura y Estructura del Proyecto

El codigo sigue el patron modular desacoplado por funciones y dominios de negocio:

```text
src/app/
├── core/
├── models/
│   ├── author.model.ts      # Modelos y contratos de autores
│   └── book.model.ts        # Modelos y contratos de libros
├── books/                   # Modulo de libros
│   ├── books.routes.ts      # Rutas hijas con Lazy Loading
│   ├── pages/
│   │   ├── book-list/       # Listado general de libros
│   │   ├── book-detail/     # Detalle de libro y autor vinculado
│   │   └── book-form/       # Formulario reactivo (Crear / Editar)
│   └── services/
│       └── book.service.ts  # Cliente HTTP tipado para /api/books
├── authors/                 # Modulo de autores
│   ├── authors.routes.ts    # Rutas hijas con Lazy Loading
│   ├── pages/
│   │   ├── author-list/     # Listado con calculo de libros asociados
│   │   └── author-form/     # Formulario reactivo (Crear / Editar)
│   └── services/
│       └── author.service.ts# Cliente HTTP tipado para /api/authors
└── shared/                  # Modulo compartido
    └── components/
        └── navbar/          # Barra de navegacion principal
```

---

## Caracteristicas Tecnicas Implementadas

* **Standalone Components:** Implementacion limpia sin archivos `NgModule` heredados.
* **Lazy Loading:** Modulos `Books` y `Authors` cargados bajo demanda mediante `loadChildren` y `loadComponent`.
* **State Management reactivo:** Uso de `signal()` de Angular para control de estado local (`isLoading`, `errorMessage`, colecciones y entidades).
* **Consumo HTTP Optimizado:** `provideHttpClient(withFetch())