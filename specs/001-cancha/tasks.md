# TASKS — Cancha MVP

Tareas ordenadas por dependencia. Cada ítem tiene alcance acotado y condición verificable.

- [x] **T01 — Definir Constitución y alcance.** Registrar principios, límites y aclaraciones del MVP. **RF:** —. **Hecho cuando:** docs y decisiones de alcance están versionadas.
- [x] **T02 — Especificar comportamiento.** Escribir RF/CA, casos límite y fuera de alcance. **RF:** RF-01–RF-05. **Hecho cuando:** cada flujo y error observable tiene criterio verificable.
- [x] **T03 — Diseñar arquitectura y esquema.** Documentar módulos, modelo, reglas, persistencia y trazabilidad. **RF:** RF-01–RF-05. **Hecho cuando:** plan enlaza cada módulo y prueba con CA.
- [x] **T04 — Crear interfaz base y estilos responsive.** Estructura semántica, navegación y formularios. **RF:** RF-01, RF-05. **Hecho cuando:** el sitio presenta navegación accesible en móvil/escritorio.
- [x] **T05 — Implementar y probar reglas de jugadores.** Validar nombre, dorsal único y posición. **RF:** RF-02. **Hecho cuando:** pruebas positivas y negativas pasan.
- [x] **T06 — Implementar y probar reglas de partidos.** Validar rival, fecha, condición y marcador/estado. **RF:** RF-03. **Hecho cuando:** programados no afectan la tabla y los marcadores inválidos se rechazan.
- [x] **T07 — Implementar tabla y resumen puros.** Calcular métricas, puntos y orden. **RF:** RF-01, RF-04. **Hecho cuando:** victorias, empates, derrotas y desempates están probados.
- [x] **T08 — Implementar persistencia local segura.** Guardar/cargar estado versionado y reportar errores. **RF:** RF-05. **Hecho cuando:** round-trip y datos corruptos/fallos tienen pruebas.
- [x] **T09 — Integrar flujos de interfaz.** Conectar CRUD, navegación, estado vacío, mensajes y renderizado. **RF:** RF-01–RF-05. **Hecho cuando:** flujos se verifican manualmente y cambios se guardan.
- [x] **T10 — Documentar ejecución y verificar entrega.** README, pruebas, revisión final de cobertura. **RF:** RF-01–RF-05. **Hecho cuando:** `node --test` pasa y los CA se relacionan con evidencia.

## Matriz breve de cobertura

| Requisitos | Componentes | Pruebas/evidencia |
| --- | --- | --- |
| RF-01, CA-01.* | `domain.js`, `app.js` | `domain.test.mjs`; revisión UI de resumen y vacíos |
| RF-02, CA-02.* | `domain.js`, `app.js` | `domain.test.mjs`; revisión UI de alta/baja |
| RF-03, CA-03.* | `domain.js`, `app.js` | `domain.test.mjs`; revisión UI de partidos |
| RF-04, CA-04.* | `domain.js`, `app.js` | `domain.test.mjs`; revisión UI de tabla |
| RF-05, CA-05.* | `storage.js`, `app.js` | `storage.test.mjs`; revisión de recarga/navegación |
