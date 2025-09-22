# 🏫 Portal de Capacitaciones

Repositorio del proyecto de prueba técnica: un portal de capacitaciones con backend en Node.js y frontend en React, usando MongoDB como base de datos y desplegado en Render y Netlify.

---

## 🚀 Tecnologías utilizadas

**Backend:**  
- Node.js  
- Express (servicios REST)  
- MongoDB + Mongoose  
- JSON Web Tokens (JWT)  
- bcryptjs  
- dotenv  
- cors  

**Frontend:**  
- React  
- React Router DOM  
- Axios  
- Vite  

**Despliegue:**  
- Backend: Render ([link aquí](https://portal-capacitaciones.onrender.com))  
- Frontend: Netlify ([link aquí](https://portal-capacitaciones.netlify.app))  

---

## 📦 Instalación y uso local

### 1️⃣ Backend
1. Crear un archivo `.env` en la carpeta del backend con las siguientes variables de ejemplo:

PORT=4000
JWT_SECRET=token_ejemplo_123
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/portal


> Asegúrate de usar un usuario y contraseña válidos de tu cluster de MongoDB.

2. Instalar dependencias:

```bash
npm install
```
3. Inicializar colecciones de ejemplo (opcional):
   
```bash
node src/seedAdmin.js
node src/seedCursos.js
```
4. Levantar el servidor:

```bash
npm run dev
# o
npm start
```

5. Probar las rutas con Postmano Thunder Client:

```bash
http://localhost:4000/api/admin/cursos
http://localhost:4000/api/users/login
```

### 2️⃣ Frontend

1. Instalar dependencias:
   
```bash
pnpm install
```

2. Iniciar el servidor de desarrollo:
   
```bash
pnpm dev
```

3. Abrir en el navegador:
   
```bash
http://localhost:5173
```
Nota: El frontend ya está configurado para consumir el backend en Render. Asegúrate de que src/api.js tenga la URL correcta de tu backend.

## 🔗 Endpoints principales (REST)

**Usuarios:**

- POST /api/users/register – Registrar nuevo usuario

- POST /api/users/login – Login de usuario

**Cursos (Admin):**

- GET /api/admin/cursos – Listar cursos

- GET /api/admin/cursos/:id – Obtener curso por ID

- POST /api/admin/cursos – Crear curso

- PUT /api/admin/cursos/:id – Actualizar curso

- DELETE /api/admin/cursos/:id – Eliminar curso

## 📝 Recomendaciones

- Asegúrate de crear un .env con tus credenciales de MongoDB.

- Usar Postman o Thunder Client facilita probar los servicios REST antes de integrar con el frontend.

- Para producción, el backend está disponible en Render y el frontend en Netlify.
