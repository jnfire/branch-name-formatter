# Branch Name Formatter

*Read this in [English](README.md).*

Una herramienta web rápida y local-first diseñada para que los desarrolladores generen nombres de ramas de Git consistentes al instante.

Todo el procesamiento se realiza localmente en tu navegador web, garantizando un **control total** de tus datos (Local-First). Construido con **Vue 3 (Composition API)** y **TypeScript**.

**▶ [Pruébalo: branches.jnfire.dev/](https://branches.jnfire.dev/)**

![Branch Name Formatter en escritorio y móvil](docs/screenshots/branch-name-formatter-hero.png)

## Características Clave
- **Nombre en vivo:** El nombre de la rama se actualiza mientras escribes, con cada campo de su color. Al copiarlo se guarda también en el historial, y el formato que elegiste es el que encuentras la próxima vez.
- **Tus propios formatos:** Incluye tres formatos listos para usar (formato por defecto, GitFlow, Conventional Commits) y tiene su propia sección para crear, clonar, editar o borrar los tuyos, con previsualización en vivo, un ejemplo opcional para probar y un aviso si la plantilla tiene un error.
- **Nombres Siempre Válidos:** El saneado (quitar tildes, espacios, puntos, caracteres especiales, colapsar guiones...) se aplica siempre, así que cada nombre generado es un nombre de rama válido en git. Solo eliges la capitalización por campo (mayúsculas, minúsculas o tal cual).
- **Saneado Consciente del Idioma:** Cada formato tiene un idioma asociado (los 6 idiomas que soporta la app) que controla cómo se traducen la `/` y caracteres específicos de cada idioma (`ñ`, `ß`...) al nombre de la rama.
- **Historial:** Guarda tus últimos 10 nombres copiados para un acceso rápido (almacenado localmente).
- **Copia de seguridad:** Exporta tus formatos a un archivo e impórtalos en otro equipo, desde los Ajustes.
- **Procesamiento Local:** Todo sucede en el lado del cliente. Sin almacenamiento ni procesamiento en servidor de tus datos de ramas.
- **Sin rastreo:** sin cookies, sin analítica y sin registro.
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

## 📚 Documentación

- [Arquitectura](docs/ARCHITECTURE_ES.md)
- [Sistema de diseño](docs/DESIGN-SYSTEM-es.md), compartido con las otras herramientas del portafolio
- [Roadmap](docs/ROADMAP-es.md)
- [Evolución](docs/evolution/README-es.md): cómo ha cambiado el proyecto, con capturas

## 🤝 Desarrollo

Diseñado y dirigido por [Javier Nicolás Pérez Mesa](https://github.com/jnfire): el producto, la arquitectura y las decisiones de diseño son del autor. La IA ha formado parte del trabajo como un experimento deliberado para aprender tecnología nueva: Gemini CLI, Antigravity, GitHub Copilot y Claude Code, probados uno tras otro. Empezó con pequeñas intervenciones y, a medida que avanzaba el experimento, fue ganando autonomía, siempre mediante pull requests que revisa el autor. Los commits hechos con Claude Code llevan un `Co-Authored-By`.

## Licencia
Copyright (C) 2026 Javier Nicolás Pérez Mesa.

Este proyecto es software libre publicado bajo la [Licencia Pública General Affero de GNU v3.0](LICENSE) (`AGPL-3.0-only`). Puedes usarlo, estudiarlo, modificarlo y compartirlo. Si distribuyes una versión modificada, o la ofreces a usuarios a través de una red, debes publicar su código fuente bajo la misma licencia.

---
Hecho por [Javier Nicolás Pérez Mesa](https://github.com/jnfire), 2026.
