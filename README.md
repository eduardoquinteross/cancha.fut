# Cancha ⚽

**Cancha** es una aplicación web educativa en español para que un equipo amateur organice su plantilla y sus partidos en un mismo lugar. Al registrar los marcadores, calcula automáticamente el balance y la clasificación.

El proyecto se desarrolló siguiendo **Spec-Driven Development (SDD)**: primero se define qué debe hacer el producto, luego cómo construirlo, se divide el trabajo en tareas y finalmente se verifica contra los requisitos. La SPEC aprobada es la fuente de verdad del comportamiento.

No es una landing page: es un panel de gestión con cuatro secciones funcionales (**Resumen, Plantilla, Partidos y Clasificación**).

## Empezar

Necesitas **Python 3** para servir la web localmente y **Node.js 18 o posterior** para ejecutar las pruebas. No hay dependencias de ejecución ni es necesario instalar paquetes.

1. En la raíz del proyecto ejecuta `python -m http.server 8000`.
2. Abre `http://localhost:8000` en el navegador.
3. Para parar el servidor, pulsa `Ctrl+C` en la terminal.

La aplicación guarda los datos en `localStorage` del navegador y origen actual. No usa cuentas ni nube; borrar los datos del sitio elimina el registro. Se inicia con el equipo de ejemplo **Atlético del Barrio**. Los cambios son locales y no se sincronizan con otros dispositivos.

## Pruebas

```bash
npm test
```

Usa el test runner incluido en Node.js, sin instalar dependencias. Cubre reglas de dominio, estadísticas y persistencia con almacenamiento simulado.

## Cómo se aplica SDD

1. [`docs/constitution.md`](docs/constitution.md) fija los principios innegociables.
2. [`specs/001-cancha/spec.md`](specs/001-cancha/spec.md) define usuarios, alcance, historias, requisitos funcionales (RF), criterios de aceptación, casos límite y exclusiones.
3. [`specs/001-cancha/clarifications.md`](specs/001-cancha/clarifications.md) registra decisiones de alcance para no convertir supuestos en requisitos ocultos.
4. [`specs/001-cancha/plan.md`](specs/001-cancha/plan.md) relaciona requisitos con arquitectura, modelo de datos y pruebas.
5. [`specs/001-cancha/tasks.md`](specs/001-cancha/tasks.md) desglosa el trabajo y su trazabilidad.
6. [`specs/001-cancha/verification.md`](specs/001-cancha/verification.md) presenta las pruebas ejecutadas, resultados y límites conocidos.

## Estructura del proyecto

```text
docs/constitution.md          Principios innegociables
specs/README.md               Flujo SDD
specs/001-cancha/             SPEC, aclaraciones, plan, tareas y verificación
src/domain.js                  Validaciones y cálculos puros
src/storage.js                 Persistencia local versionada
src/app.js                     Interfaz y coordinación de eventos
src/styles.css                 Interfaz responsive
tests/                         Pruebas unitarias Node
```

## Alcance MVP

- Añadir/eliminar jugadores (nombre, dorsal único 1–99 y posición).
- Programar partidos locales/visitantes; registrar marcador entero no negativo y eliminar partidos.
- Ver resumen, calendario, plantilla y tabla (3 puntos por victoria, 1 por empate).
- Tabla ordenada por puntos, diferencia de goles, goles a favor y nombre.
- Persistencia local al recargar en el mismo navegador.

No incluye backend, autenticación, sincronización, gestión de varios equipos ni estadísticas individuales. La especificación fuente de verdad está en `specs/001-cancha/spec.md`; las decisiones técnicas, en `plan.md`.

## Antes de entregar

- Ejecutar `npm test` y comprobar que no haya pruebas fallidas.
- Arrancar la aplicación y probar: alta de jugador, programación de partido, registro de marcador y clasificación.
- Revisar el diseño en escritorio y en un ancho móvil; los resultados documentados están en `specs/001-cancha/verification.md`.
- Incluir el enlace al repositorio en la entrega de la asignatura.
