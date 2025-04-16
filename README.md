# Prueba Técnica React - Gestión de Usuarios

Aplicación SPA construida con React que incluye autenticación con roles, manejo de sesión y gestión de datos de usuarios.

## 🚀 Demo

[Ver aplicación en vivo](https://zoco-test-2c6y6103d-nahuel-benitezs-projects.vercel.app/) 

## 📌 Características Principales

- **Autenticación segura** con roles (admin/user)
- **Dashboard adaptativo** según tipo de usuario
- **Gestión completa** de usuarios, estudios y direcciones
- **Diseño responsive** mobile-first
- **Persistencia de sesión** con sessionStorage
- **Validación de formularios** con Yup y React Hook Form
- **Tablas avanzadas** con MUI DataGrid

## 🛠 Tecnologías Utilizadas

- React 19 con Hooks
- React Router DOM v7
- Context API para gestión de estado
- Material UI v7 + MUI X DataGrid
- React Hook Form + Yup para formularios
- Vite como build tool

## 📦 Estructura del Proyecto
- `src/`

  ├── `api/`          # API mock y servicios  
  ├── `assets/`       # Recursos estáticos  
  ├── `components/`   # Componentes reutilizables  
  │   ├── `auth/`     # Componentes de autenticación  
  │   ├── `common/`   # Componentes compartidos  
  │   ├── `dashboard/`# Componentes del dashboard  
  │   └── `layout/`   # Componentes de layout  
  ├── `context/`      # Contextos de aplicación  
  ├── `data/`         # Datos iniciales  
  ├── `hooks/`        # Custom hooks  
  ├── `pages/`        # Páginas de la aplicación  
  │   ├── `auth/`     # Páginas de autenticación  
  │   └── `dashboard/`# Páginas del dashboard  
  ├── `routes/`       # Configuración de rutas  
  ├── `styles/`       # Estilos globales  
  └── `utils/`        # Utilidades varias


## 🔑 Credenciales de Acceso

**Usuario Admin:**
- Email: admin@example.com
- Password: password123

**Usuario Normal:**
- Email: user@example.com
- Password: password123

## 🚀 Cómo Ejecutar Localmente

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/NahuelBenitez/zoco-test.git

2. Instalar Dependencias:
   ```bash
    npm install
3. Iniciar servidor de desarrollo:
   ```bash
    npm run dev

4. Abrir en el navegador:
   ```bash
    http://localhost:5173
## 🌟 Funcionalidades Implementadas

### Para todos los usuarios
- ✅ Autenticación segura 
- ✅ Dashboard personalizado según rol  
- ✅ Gestión de perfil propio  
- ✅ CRUD completo de estudios y direcciones  
- ✅ Diseño completamente responsive  

### Específicas para Admin
- ✅ Listado completo de usuarios  
- ✅ Creación de nuevos usuarios  
- ✅ Acceso a datos de todos los usuarios  
- ✅ Gestión de estudios/direcciones de cualquier usuario  

### Específicas para Usuario Normal
- ✅ Acceso solo a sus propios datos  
- ✅ Edición de su perfil  
- ✅ Gestión de sus estudios y direcciones  


##  Autor
**Autor**: Jorge Nahuel Benitez
**Conéctate conmigo:**

- [LinkedIn](https://www.linkedin.com/in/nahuel-benitez-55b7601a4/) 
- [WhatsApp](https://wa.me/+5493814427415) 

---

**Licencia:**
Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` en el repositorio para más detalles.

---

