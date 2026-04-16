# 🚀 CMS Multi-tenant para Testimonios EdTech

## 🧠 Overview

Plataforma SaaS tipo **CMS multi-tenant** para gestionar testimonios en empresas EdTech, con control de acceso por roles y workflow de aprobación.

---

🔌 API Documentation

La API se encuentra documentada con Swagger, donde se pueden visualizar todos los endpoints, parámetros y respuestas.

👉 Swagger UI: [https://s03-26-equipo-14-web-app-development.onrender.com/docs]

---

## 🎯 Problema

Las instituciones con comunidades activas necesitan demostrar el impacto de sus productos o programas mediante experiencias reales de usuarios.

Sin embargo:

* Los testimonios están dispersos
* No existe control de calidad
* No se pueden reutilizar fácilmente

---

## 💡 Solución

Se desarrolló un CMS que permite:

* Centralizar testimonios
* Moderarlos antes de publicarlos
* Clasificarlos y filtrarlos
* Integrarlos en otros sitios mediante API

---

## 🏗️ Arquitectura

* Multi-tenant por `organizationId`
* RBAC (Role-Based Access Control)
* Separación por módulos (NestJS)
* ORM con Prisma

---

## ⚙️ Funcionalidades

* Gestión de organizaciones, proyectos, testimonios y usuarios
* CRUD de testimonios (quote, case, video)
* Workflow de aprobación
* Filtros avanzados
* Formulario público (visitor)
* Autosave en frontend

---

## 🧪 Casos de Uso

* Empresas que necesitan validar testimonios antes de publicarlos
* Equipos de marketing que reutilizan contenido
* Plataformas educativas con múltiples cursos

---

## 🧠 Decisiones Técnicas

* Arquitectura modular
* Separación por organización (multi-tenant)
* Workflow basado en estados
* RBAC para control de acceso
  
---

## 🚧 Desafíos

* Manejo de permisos complejos
* Flujo de estados consistente
* Validación de formularios dinámicos

---

## 🛠️ Stack

* Node.js
* NestJS
* Prisma
* Next.js
* PostgreSQL

Media

* Cloudinary
* YouTube API

---

## ⚙️ Setup

1. Instalar dependencias : `pnpm i`.
2. `pnpm --filter=database db:generate`
3. `pnpm build`
4. Añadir las variables de entorno
5. `pnpm dev`

---

## 👨‍💻 Equipo

Proyecto desarrollado por:

* Franco Casafus (@francocasafus22) — Backend
* Emanuel Funes (@EmanuelFuneS) - Backend
* Gabriela Díaz (@G9D4) - Frontend
* Lautaro Durán (@LautaroLD) - Frontend
* Santiago Soto (@SH-ur) - Backend
* Zulay Peraza (@Zulay7424) - Tester QA

Proyecto realizado en el contexto de No Country 🚀

---

## 🔗 Repo

https://github.com/No-Country-simulation/S03-26-Equipo-14-Web-App-Development
