# Branch Name Formatter

*Read this in [English](README.md).*

Una herramienta web rápida y local-first diseñada para que los desarrolladores generen nombres de ramas de Git consistentes al instante.

Todo el procesamiento se realiza localmente en tu navegador web, garantizando un **control total** de tus datos (Local-First). Construido con **Vue 3 (Composition API)** y **TypeScript**.

## Características Clave
- **Formatos de Rama Dinámicos:** Incluye tres formatos listos para usar (formato por defecto, GitFlow, Conventional Commits) y permite crear, clonar, editar o borrar los tuyos propios desde la pantalla de Configuración, con previsualización en vivo mientras escribes.
- **Nombres Siempre Válidos:** El saneado (quitar tildes, espacios, puntos, caracteres especiales, colapsar guiones...) se aplica siempre, así que cada nombre generado es un nombre de rama válido en git. Solo eliges la capitalización por campo (mayúsculas, minúsculas o tal cual).
- **Saneado Consciente del Idioma:** Cada formato tiene un idioma asociado (los 6 idiomas que soporta la app) que controla cómo se traducen la `/` y caracteres específicos de cada idioma (`ñ`, `ß`...) al nombre de la rama.
- **Gestión de Historial:** Mantiene un registro de tus últimos 10 nombres generados para un acceso rápido (almacenado localmente).
- **Procesamiento Local:** Todo sucede en el lado del cliente. Sin almacenamiento ni procesamiento en servidor de tus datos de ramas.
- **Interfaz:** Diseño limpio, profesional y responsivo con soporte nativo para modo oscuro/claro.
- **Multilingüe:** Soporte completo de interfaz para Español, Inglés, Francés, Alemán, Italiano y Portugués — incluyendo el editor de formatos y los propios formatos predefinidos.

## Construido Con
- **Vue.js 3** (Composition API) + **Vite**
- **TypeScript** para un código robusto y tipado.
- **Vue-i18n** para soporte multilingüe.
- **CSS Vanilla / SCSS** para un rendimiento óptimo y un aspecto profesional "nativo".

## Arquitectura del Proyecto
El proyecto separa la lógica de negocio (`BranchManager`, `FormatManager`, `BranchFormatter`) de los componentes de la vista. Consulta [`docs/ARCHITECTURE_ES.md`](docs/ARCHITECTURE_ES.md) para más detalles.

## Registro de Cambios
Los cambios notables de cada versión se documentan en [`CHANGELOG.md`](CHANGELOG.md). El número de versión vive en `package.json` y se muestra en directo en el pie de página de la app.

## Cómo Ejecutar Localmente
```sh
npm install
npm run dev
```

## Licencia
Copyright (C) 2026 Javier Nicolás Pérez Mesa.

Este proyecto es software libre publicado bajo la [Licencia Pública General Affero de GNU v3.0](LICENSE) (`AGPL-3.0-only`). Puedes usarlo, estudiarlo, modificarlo y compartirlo. Si distribuyes una versión modificada, o la ofreces a usuarios a través de una red, debes publicar su código fuente bajo la misma licencia.

---
Hecho con cuidado, 2026.
