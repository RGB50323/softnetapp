Softnet App — Prueba Técnica

# Pasos para correr el proyecto localmente
Aplicación de gestión de inventario construida con Next.js (App Router), Supabase (Auth + Postgres) y Tailwind CSS.

# Stack
- Frontend: Next.js 16 (App Router) + TypeScript
- Backend / datos: Supabase (Postgres + Auth)
- Estilos: Tailwind CSS
- Gráficos: Recharts
- Notificaciones (Toast): Sonner
- Testing: Vitest
- Deploy: Vercel

# Cómo correr el proyecto localmente

*Nota: estos dos primeros comandos son los que se usaron originalmente para crear el proyecto según el enunciado de la guía; no hace falta correrlos si ya se clonó el repositorio, los agregué para mostrar cuales usé.*
- Crear el proyecto: `npx create-next-app@latest`.*
- Instalar el cliente: `npm install @supabase/supabase-js`.*

- Clonar el repositorio y entrar a la carpeta del proyecto: bash y hacer git clone <url-del-repo> cd softnetapp
- Instalar las dependencias (`npm install`): incluye Supabase, Recharts, Lucide React, Sonner y Vitest, entre otras.
- Crear un archivo .env.local en la raíz del proyecto con las credenciales de tu proyecto de Supabase:
   - NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   - NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

En el SQL Editor de tu proyecto de Supabase, correr el script de creación de tabla y datos de ejemplo (sección 5 del enunciado).
En Authentication → Users, crear un usuario de prueba (email + contraseña) para poder iniciar sesión en la app.

- Correr el servidor de desarrollo: npm run dev
- Abrir http://localhost:3000 — la app redirige automáticamente a /login.
- Correr los tests: npm run test

# Decisiones técnicas
- Server Components + Client Components separados: las páginas que necesitan datos de Supabase (listado de productos, detalle, dashboard) se resuelven como Server Components para hacer el fetch en el servidor, y delegan la interactividad (filtros, formularios, botones) a Client Components hijos. Esto evita exponer lógica innecesaria al cliente y aprovecha el renderizado en servidor de Next.js.

- Tres clientes de Supabase distintos (client.ts, server.ts, y el usado en proxy.ts), siguiendo el patrón oficial de @supabase/ssr: cada contexto de ejecución en Next.js (browser, Server Component, middleware) maneja las cookies de sesión de forma distinta, por lo que no existe un único cliente universal.

- Para las traducciones se implementó un LanguageProvider con React Context y archivos JSON (es.json / en.json) en vez de next-intl y un servicio para facilitar su implementación debido al tiempo que tenemos para la prueba.

- Se implementó paginación en la tabla de productos para mejorar el orden de la UI, sin servicio, implementada desde esa sección por el mismo tema del tiempo.
  
- Utilización de múltiples componentes que permitían mantener la misma UI y optimizar código en diferentes zonas, además de que siempre es buena práctica para fomentar la escalabilidad, calidad y ordenamiento de código, además de modals de confirmación para cuidar a los usuarios de ciertas decisiones (como eliminar cosas).

- Múltiples validaciones en formularios para evitar cualquier tipo de conflicto, incluido la validación de SKU en productos (tomado este como identificador).


# ¿Qué mejoraría con el tiempo?
- Me gustaría agregar más al dashboard, permitir que se vea un trackeo de los productos en forma más extendida con muchas más gráficas que permitan una extracción mayor de datos con ayuda de los KPIs.
- Por la parte visual, muchos más componentes de reutilización, especialmente en la parte del formulario para seleccionar fechas o cantidades, además de mejorar la UI de la página web, un mejor tipo de letra, mejor organización, etcétera.
- Con más tiempo, pasaría tanto el i18n como la paginación a soluciones más escalables: el i18n a un servicio como next-intl en vez del Context + JSON custom actual, y la paginación a un enfoque del lado del servidor, resolviendo la lógica de límites y offsets desde el backend en vez de paginar en memoria sobre los datos ya cargados en el cliente.
- Agregaría manejo de roles y permisos para diferenciar qué puede ver o modificar cada tipo de usuario, en vez del acceso único que existe ahora una vez autenticado.
