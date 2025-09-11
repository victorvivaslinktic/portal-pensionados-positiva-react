# 🧓 Portal de Pensionados – Frontend

Este repositorio contiene el **frontend del Portal de Pensionados**.  
Para asegurar un flujo de trabajo fluido y evitar problemas en producción, sigue estas instrucciones.

---

## 🚀 Configuración e Inicio del Proyecto

1. **Clonar el repositorio:**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   ```
2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Ejecutar en modo de desarrollo:**
   ```bash
   npm run dev
   ```

Esto levantará el proyecto en http://localhost:3000 (o en el puerto configurado).

🚧 Proceso de Build y Despliegue

⚠️ ATENCIÓN
Antes de hacer un commit, es obligatorio probar el build para garantizar que los cambios funcionen en producción.

El proceso de build:

Optimiza los archivos.

Valida la sintaxis.

Detecta errores que no aparecen en modo de desarrollo.

👉 Si el build falla, la aplicación no funcionará en producción.

Flujo de trabajo recomendado:

Termina tus cambios.

Ejecuta el build localmente:

npm run build

Prueba la versión final del sitio:

Si el build fue exitoso, se generará una carpeta llamada out.

Para probarla, ejecuta:

npx serve out

Si esta prueba funciona, entonces solo entonces sube tus cambios. Si falla, corrige los errores y prueba nuevamente.

⚠️ Advertencia sobre basePath

En el archivo next.config.ts encontrarás la siguiente línea:

basePath: "/portal-pensionados",

Para trabajar en local, puedes comentarla:

// basePath: "/portal-pensionados",

IMPORTANTE: Antes de hacer un commit, asegúrate de que la línea esté descomentada.
El build de producción requiere esta configuración para que el sitio funcione correctamente en el servidor.
👉 Si subes el código con esta línea comentada, el despliegue fallará.

(Pronto se subirá una solución para evitar la molestia de comentar y descomentar el basePath)
