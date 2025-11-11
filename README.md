<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# SchoolHub - Backend 🚀

Este repositorio contiene el backend del proyecto **SchoolHub**, un panel de gestión integral para colegios (usuarios, cursos, materias, inscripciones, actividades y entregas) con Prisma + PostgreSQL.

---

## 📚 Stack Tecnológico

* **Framework**: NestJS 11
* **Lenguaje**: TypeScript
* **ORM**: Prisma
* **Base de Datos**: PostgreSQL
* **Autenticación**: JWT
* **Documentación API**: Swagger
* **Validación**: Class Validator / Class Transformer

---

## 🚀 Empezando

Sigue estos pasos para levantar el entorno de desarrollo local.

### Prerrequisitos

Asegúrate de tener instalado lo siguiente:

* [Node.js](https://nodejs.org/en/) (v18+ recomendado)
* [PostgreSQL](https://www.postgresql.org/download/) (Opcional si usas Docker)
* [Git](https://git-scm.com/downloads)
* [Docker](https://www.docker.com/products/docker-desktop/) (Recomendado para la base de datos)

### Instalación

1.  **Clonar el repositorio**
    ```bash
    git clone [https://github.com/MitiGz/schoolhub-backend.git](https://github.com/MitiGz/schoolhub-backend.git)
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno**
    Crea una copia del archivo de ejemplo `.env.example` y llámala `.env`:
    ```bash
    cp .env.example .env
    ```
    Ahora, edita el archivo `.env` con la URL de conexión a tu base de datos PostgreSQL.

4.  **Levantar la base de datos**
    ```bash
    docker-compose up -d
    ```

5.  **Correr las migraciones de Prisma**
    Asegúrate de que tu base de datos esté corriendo y sea accesible. Luego, ejecuta:
    ```bash
    npx prisma migrate dev
    ```

---

## Corriendo la Aplicación

Para iniciar la aplicación en modo de desarrollo:

```bash
npm run start:dev

