# Repwise — Entrena con cabeza

Aplicación móvil de entrenamiento desarrollada con **Ionic + React + Capacitor**, con autenticación en **Firebase**, datos en **Supabase** y mapas para las carreras.

## Enlaces del proyecto

- **Repositorio:** https://github.com/Michelburgos/Repwise-app
- **Prototipo en vivo (Lovable):** https://repwise-ruta-y-ritmo.lovable.app
- **Editor Lovable:** https://lovable.dev/projects/257b3955-8438-56b7-983a-bd46aad2532f
- **Documento del proyecto:** [`supabase/schema.sql`](supabase/schema.sql) y este README.

## Integrantes

| Integrante | Rama de trabajo |
|---|---|
| Juan David Daza | `juan-david-daza` |
| Michel Burgos Santos | `michel-burgos-santos` |

Las ramas se integran sobre `main` para la entrega final.

## Tecnologías

- **Ionic React 9** + **React 19**
- **Capacitor 8** (Android)
- **Firebase Authentication** (correo y contraseña)
- **Supabase**: Postgres, Auth, Storage y Realtime
- **Leaflet + react-leaflet** con tiles de **Esri World Street Map**
- **Vite 8**, CSS Modules y SCSS/CSS
- **Capacitor Motion, Geolocation, Camera, Haptics y Network**
- **Vitest** y **Cypress** para pruebas

## Funcionalidades

- Registro e inicio de sesión con Firebase Authentication.
- Rutinas de gimnasio con ejercicios, series y repeticiones.
- Modo técnica con conteo de repeticiones por acelerómetro, cronómetro y feedback de ritmo.
- Carreras con GPS, mapa, distancia, tiempo y ritmo.
- Historial de entrenamientos y carreras.
- Fotos de progreso con comparación antes/ahora y línea de tiempo.
- Racha de entrenamiento y mejor racha.
- Panel de administración protegido por Firebase.
- Actualización en tiempo real de la lista de rutinas con Supabase Realtime.
- Aviso de “sin conexión” y mensajes de error amigables.

## Estructura del proyecto

```text
src/
├─ components/          # Componentes reutilizables (UI)
├─ context/             # AuthContext (Firebase + sesión de datos)
├─ firebase/            # Configuración e inicialización de Firebase
├─ helpers/             # Funciones generales y mensajes de error
├─ hooks/               # Sensores, cámara, GPS, rutinas, racha...
├─ lib/                 # Cliente de Supabase
├─ pages/               # Pantallas de la app
│  └─ admin/            # Panel administrativo
├─ routes/              # AppRoutes, UserRoutes y AdminRoutes
└─ theme/               # Variables y sistema de diseño
```

## Autenticación: Firebase + Supabase

Firebase Authentication es el proveedor de identidad:

- Registro con `createUserWithEmailAndPassword`.
- Inicio de sesión con `signInWithEmailAndPassword`.
- Cierre de sesión con `signOut`.

Como los datos viven en Supabase y las políticas RLS usan `auth.uid()`, la app mantiene además una **sesión de datos en Supabase con las mismas credenciales**. El usuario no ve este paso: al iniciar sesión se autentica en Firebase y se abre la sesión de Supabase necesaria para leer/escribir sus rutinas, series, carreras y fotos.

- Si el usuario ya existía solo en Supabase, al iniciar sesión se crea su cuenta de Firebase automáticamente.
- Si el usuario ya existía solo en Firebase, se crea su cuenta de Supabase para habilitar los datos.
- Si Supabase tiene la confirmación de correo activa, el usuario debe confirmar antes de acceder a sus datos.

### Panel de administración

Las rutas `/admin` solo se montan para usuarios administradores. Se considera administrador si:

1. Su correo está en `VITE_ADMIN_EMAILS`, o
2. Su token de Firebase tiene el custom claim `admin: true`.

El panel permite revisar la cuenta administrativa y abrir Firebase Console o el panel de Supabase.

## Instalación

```bash
git clone https://github.com/Michelburgos/Repwise-app.git
cd Repwise-app
npm install
cp .env.example .env
# Completa las variables del .env
npm run dev
```

Abre `http://localhost:5173`.

### Android

```bash
npm run build
npx cap sync android
npx cap run android
```

También se puede abrir la carpeta `android/` directamente en Android Studio.

## Variables de entorno

Archivo `.env` en la raíz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_ADMIN_EMAILS=tu-correo@dominio.com
```

- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: proyecto de Supabase. Vite está configurado con `envPrefix` para aceptar también los nombres `VITE_*`.
- `VITE_ADMIN_EMAILS`: correos separados por coma que pueden entrar a `/admin`.

La configuración pública de Firebase está en [`src/firebase/config.js`](src/firebase/config.js). La API key web de Firebase no es un secreto; la seguridad real está en las reglas de Firebase y en las políticas RLS de Supabase.

## Base de datos

El esquema completo, permisos, RLS y Storage está en [`supabase/schema.sql`](supabase/schema.sql). Ejecútalo en **Supabase → SQL Editor**.

Resumen de tablas:

- `routines`: rutinas del usuario.
- `workout_sessions`: series/entrenamientos terminados.
- `runs`: carreras con recorrido GPS.
- `progress_photos`: fotos de progreso.
- Bucket `progress` en Storage.

## APIs y servicios consumidos

| Servicio | Uso |
|---|---|
| Firebase Authentication | Registro, login y sesión |
| Supabase Auth | Sesión de datos para RLS |
| Supabase PostgREST | CRUD de rutinas, series, carreras y fotos |
| Supabase Storage | Fotos de progreso |
| Supabase Realtime | Actualización de rutinas |
| Esri World Street Map | Tiles del mapa de carreras |
| OpenStreetMap | Datos base del mapa |

## Scripts

```bash
npm run dev          # servidor de desarrollo
npm run build        # build de producción
npm run preview      # previsualizar build
npm run test.unit    # pruebas unitarias (Vitest)
npm run test.e2e     # pruebas E2E (Cypress)
npm run lint         # ESLint
```

## Rutas principales

- `/login`, `/register`
- `/app/routines`, `/app/routines/:id`
- `/app/form`
- `/app/run`, `/app/run/:id`
- `/app/progress`
- `/app/history/:id`
- `/admin` (solo administradores)

## Aportes y ramas

Cada integrante trabaja en su rama (`juan-david-daza`, `michel-burgos-santos`) y los cambios se integran en `main` mediante merge. Antes de entregar, verifica que `main` contenga la versión final y que el repositorio esté actualizado en GitHub.

## Limitaciones conocidas

- La app requiere internet para leer/escribir en Supabase y para cargar los tiles del mapa.
- El envío de correos de confirmación de Supabase tiene límites si no se configura un SMTP propio.
- La administración de usuarios se realiza desde Firebase Console; la app no expone el Admin SDK por seguridad.
