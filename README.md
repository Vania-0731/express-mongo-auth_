# Express Mongo Auth

Sistema de autenticación completo con Express, MongoDB, JWT y frontend con EJS y Materialize CSS. Utiliza sessionStorage para la gestión de sesiones.

## 🚀 Características Implementadas

### ✅ Arquitectura del Sistema
- **Backend**: Express.js con arquitectura MVC
- **Base de datos**: MongoDB con Mongoose ODM
- **Autenticación**: JWT (JSON Web Tokens) con sessionStorage
- **Frontend**: EJS + Materialize CSS
- **JavaScript**: Vanilla JS con Fetch API
- **Protección de rutas**: Middlewares de autenticación y autorización
- **Gestión de sesiones**: Tokens JWT almacenados en sessionStorage

### ✅ Páginas Implementadas
- **SignIn** (`/signIn`) - Inicio de sesión
- **SignUp** (`/signUp`) - Registro de usuarios
- **Profile** (`/profile`) - Perfil del usuario (editable con cálculo de edad)
- **Dashboard User** (`/dashboard`) - Panel para usuarios regulares
- **Dashboard Admin** (`/admin`) - Panel para administradores
- **403** (`/403`) - Página de acceso denegado
- **404** - Página de error 404

### ✅ Funcionalidades del Sistema
- ✅ **Autenticación segura**: JWT con expiración configurable
- ✅ **Gestión de sesiones**: Tokens JWT almacenados en sessionStorage
- ✅ **Registro de usuarios**: Con validaciones de contraseña robustas
- ✅ **Sistema de roles**: User y Admin con permisos diferenciados
- ✅ **Protección de rutas**: Middlewares de autenticación y autorización
- ✅ **Redirección inteligente**: Según rol del usuario
- ✅ **Gestión de sesiones**: Logout con limpieza de sessionStorage
- ✅ **Manejo de errores**: Tokens expirados y validaciones
- ✅ **Validaciones**: Cliente y servidor
- ✅ **Navegación dinámica**: Menú condicional por rol
- ✅ **Feedback visual**: Mensajes de éxito/error y loading states
- ✅ **Diseño responsive**: Adaptable a todos los dispositivos
- ✅ **Cálculo automático**: Edad basada en fecha de nacimiento
- ✅ **Perfil completo**: Edición de todos los campos del usuario
- ✅ **Usuario admin**: Creado automáticamente al iniciar

## 📁 Estructura del Proyecto

```
express-mongo-auth/
├── node_modules/
├── public/                     # Archivos estáticos
│   └── js/
│       ├── guard.js           # Sistema de protección de rutas
│       ├── auth.js            # Funciones de autenticación
│       └── admin.js           # Funciones específicas de admin
├── src/                       # Código fuente del servidor
│   ├── controllers/           # Controladores
│   │   ├── AuthController.js
│   │   └── UserController.js
│   ├── middlewares/           # Middlewares
│   │   ├── authenticate.js
│   │   └── authorize.js
│   ├── models/                # Modelos de MongoDB
│   │   ├── Role.js
│   │   └── User.js
│   ├── repositories/          # Capa de repositorio
│   │   ├── RoleRepository.js
│   │   └── UserRepository.js
│   ├── routes/                # Rutas de la API
│   │   ├── auth.routes.js
│   │   └── users.routes.js
│   ├── services/              # Lógica de negocio
│   │   ├── AuthService.js
│   │   └── UserService.js
│   ├── utils/                 # Utilidades
│   │   ├── helpers.js
│   │   ├── seedRoles.js
│   │   └── seedUsers.js
│   ├── views/                 # Plantillas EJS
│   │   ├── partials/
│   │   │   ├── header.ejs
│   │   │   ├── footer.ejs
│   │   │   └── nav.ejs
│   │   ├── signIn.ejs
│   │   ├── signUp.ejs
│   │   ├── profile.ejs
│   │   ├── dashboard_user.ejs
│   │   ├── dashboard_admin.ejs
│   │   ├── 403.ejs
│   │   └── 404.ejs
│   └── server.js              # Servidor principal
├── .env.example               # Variables de entorno de ejemplo
├── .env                       # Variables de entorno (crear a partir de .env.example)
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Instalación y Uso

### Prerrequisitos
- **Node.js** (versión 14 o superior)
- **MongoDB** instalado y ejecutándose
- **npm** o **yarn**

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Copiar el archivo de ejemplo:
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus valores:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/auth_db
JWT_SECRET=f14e6a1c9843c52190c07232dfb9c0e467d5a910
JWT_EXPIRES_IN=1h
BCRYPT_SALT_ROUNDS=10
```

### 3. Asegurar que MongoDB esté ejecutándose
```bash
# En Windows (si MongoDB está instalado como servicio)
mongo --version

# En Linux/Mac
sudo systemctl start mongod
# o
mongod
```

### 4. Ejecutar el servidor
```bash
npm run dev
# o
npm start
```

### 5. Acceder a la aplicación
- Abrir navegador en: `http://localhost:3000`
- Redirige automáticamente a `/signIn`

### 6. Credenciales de administrador
El sistema crea automáticamente un usuario admin al iniciar el servidor:
- **Email:** `admin@example.com`
- **Password:** `Admin123!`

## 🔧 API REST Endpoints

### 🔐 Autenticación
- `POST /api/auth/signIn` - Iniciar sesión
- `POST /api/auth/signUp` - Registro de usuario

### 👤 Gestión de Usuarios
- `GET /api/users/me` - Obtener usuario actual (autenticado)
- `PUT /api/users/me` - Actualizar perfil del usuario (autenticado)
- `GET /api/users` - Listar todos los usuarios (solo admin)
- `GET /api/users/:id` - Obtener detalle de usuario específico (solo admin)

### 🛡️ Protección de Endpoints
- **Públicos**: `/api/auth/*`
- **Autenticados**: `/api/users/me` (cualquier usuario logueado)
- **Admin únicamente**: `/api/users` y `/api/users/:id`

## 🎯 Flujo de Autenticación Completo

### 1. **Usuario No Autenticado**
- Accede a cualquier ruta protegida → redirige a `/signIn`
- Navegación muestra: "Iniciar Sesión", "Registrarse"
- Solo puede acceder a `/signIn` y `/signUp`

### 2. **Proceso de Registro**
- Completa formulario en `/signUp` con validaciones
- Envía POST a `/api/auth/signUp`
- Backend valida datos y crea usuario con rol `user`
- Redirige automáticamente a `/signIn`
- Muestra mensaje de confirmación

### 3. **Proceso de Login**
- Completa formulario en `/signIn`
- Envía POST a `/api/auth/signIn`
- Backend valida credenciales y genera JWT
- **Token JWT guardado en sessionStorage** (gestión de sesiones)
- Redirección automática según rol:
  - `admin` → `/admin` (Dashboard de administrador)
  - `user` → `/dashboard` (Dashboard de usuario)

### 4. **Navegación Autenticada**
- Menú actualizado dinámicamente:
  - "Mi Perfil", "Dashboard", "Cerrar Sesión"
  - Si es admin: también "Admin"
- Todas las rutas protegidas son accesibles

### 5. **Protección de Rutas**
- Cada página verifica token JWT válido
- Verificación de roles para rutas específicas
- Token expirado → logout automático y redirección a `/signIn`
- Sin permisos suficientes → redirección a `/403`

### 6. **Logout**
- Limpia `sessionStorage` (elimina token JWT)
- Redirige a `/signIn`
- Muestra mensaje de confirmación
- **Gestión de sesiones**: Token eliminado del navegador

### Stack Tecnológico
- ✅ **Backend**: Express.js con arquitectura MVC
- ✅ **Base de datos**: MongoDB con Mongoose ODM
- ✅ **Autenticación**: JWT con bcrypt para hash de contraseñas
- ✅ **Gestión de sesiones**: sessionStorage para tokens JWT
- ✅ **Frontend**: EJS como motor de plantillas
- ✅ **Estilos**: Materialize CSS v1.0.0
- ✅ **JavaScript**: Vanilla JS con Fetch API
- ✅ **Almacenamiento**: sessionStorage para tokens JWT
- ✅ **Validaciones**: Cliente y servidor

## 📞 Soporte y Solución de Problemas

### Problemas Comunes

#### 1. Error de conexión a MongoDB
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solución:**
- Verificar que MongoDB esté instalado y ejecutándose
- En Windows: `net start MongoDB`
- En Linux/Mac: `sudo systemctl start mongod`

#### 2. Puerto 3000 en uso
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solución:**
- Cambiar el puerto en `.env`: `PORT=3001`
- O matar el proceso: `taskkill /PID [PID] /F` (Windows)

#### 3. Variables de entorno no encontradas
```
Error: Cannot find module '../encodings'
```
**Solución:**
- Verificar que existe el archivo `.env`
- Copiar desde `.env.example`: `cp .env.example .env`

#### 4. Token inválido o expirado
```
{"message":"Token inválido"}
```
**Solución:**
- Hacer logout y login nuevamente
- Verificar que `JWT_SECRET` sea el mismo en `.env`

### Checklist de Verificación
- [ ] MongoDB ejecutándose en puerto 27017
- [ ] Archivo `.env` creado desde `.env.example`
- [ ] Dependencias instaladas: `npm install`
- [ ] Servidor ejecutándose: `npm run dev`
- [ ] Puerto 3000 accesible: `http://localhost:3000`

### Logs Útiles
- **Consola del navegador**: F12 → Console
- **Terminal del servidor**: Ver logs de Express
- **MongoDB logs**: Verificar conexión exitosa

---

