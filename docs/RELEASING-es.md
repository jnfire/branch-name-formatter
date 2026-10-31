# Publicar una versión

*Leer esto en [Inglés](RELEASING.md).*

Las versiones siguen el [versionado semántico](https://semver.org/lang/es/): un parche para correcciones, una menor para funciones nuevas y una mayor cuando algo cambia de forma que el usuario lo note (por ejemplo, el formato de los datos guardados en el navegador o de una exportación).

1. Escribe los cambios de la versión en `CHANGELOG.md` bajo un nuevo encabezado `## [x.y.z] - fecha`.
2. Pon la misma versión en `package.json` (`npm version x.y.z --no-git-tag-version` actualiza también el lockfile).
3. Fusiónalo en `main` mediante un pull request. El despliegue se lanza solo cuando pasan lint, formato, tests y build.
4. Etiqueta el commit fusionado y sube la etiqueta:

   ```sh
   git checkout main && git pull
   git tag -a vx.y.z -m "vx.y.z"
   git push origin vx.y.z
   ```

5. El workflow **Release** comprueba que la etiqueta coincide con `package.json`, toma las notas de `CHANGELOG.md` y crea la release de GitHub. El enlace de la versión en el pie de la app apunta a esa release.

Si el workflow falla porque el changelog no tiene sección para la versión, corrige `CHANGELOG.md`, borra la etiqueta (`git push origin --delete vx.y.z`) y vuelve a etiquetar.
