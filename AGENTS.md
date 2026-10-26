# Guía de trabajo — Cancha

## Antes de cambiar el proyecto

1. Lee `docs/constitution.md` y `specs/001-cancha/spec.md`.
2. Consulta las decisiones de `clarifications.md`, el diseño de `plan.md` y las dependencias de `tasks.md`.
3. No cambies comportamiento ni esquema de datos sin actualizar primero la SPEC y reflejarlo en el PLAN.
4. Trabaja solo en tareas autorizadas; si una dependencia está pendiente, detente e indícalo.

## Calidad

- Funciones de dominio en `src/domain.js` puras y sin acceso al DOM o almacenamiento.
- Escribe primero pruebas con `node:test`, luego implementación.
- Ejecuta `npm test` y reporta el resultado real; no afirmes haber verificado manualmente un navegador si no se hizo.
- Interfaz/mensajes en español; identificadores de código en inglés.
- Sin dependencias de ejecución salvo aprobación y actualización de SPEC/PLAN.
