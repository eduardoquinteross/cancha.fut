# Verificación — Cancha MVP

**Fecha:** 2026-10-25  
**Resultado:** conforme con el alcance implementado.

## Pruebas automatizadas

Comando ejecutado desde la raíz: `npm test` (`node --test`). Resultado final: **11 pruebas aprobadas, 0 fallidas**.

| Área | Evidencia | Resultado |
| --- | --- | --- |
| Validación de jugador | `tests/domain.test.mjs` | Aprobada: dorsal límites, espacios, duplicados y posición |
| Partidos y marcador | `tests/domain.test.mjs` | Aprobada: fecha gregoriana, rival propio/repetido, marcador 0-0 y valores inválidos |
| Tabla y resumen | `tests/domain.test.mjs` | Aprobada: puntos, PJ/PG/PE/PP, goles, diferencia, desempates y programados excluidos |
| Persistencia | `tests/storage.test.mjs` | Aprobada: estado inicial, round-trip, JSON/versión/entidades inválidas y fallos de acceso |

## Verificación de interfaz en navegador

La app se abrió en `http://127.0.0.1:8000`. Se ejecutó el flujo: añadir jugador → programar partido → registrar 2–1 → consultar clasificación. Resultado observado: el equipo local aparece con 3 puntos y DG +1; el rival, con 0 puntos y DG −1. Se comprobó también que un jugador guardado seguía visible después de recargar la página. Los datos de prueba se limpiaron después de la comprobación.

La interfaz se comprobó en una ventana de escritorio. El comportamiento responsive móvil está definido en CSS, pero no se hizo una revisión manual en un dispositivo móvil real.

## Trazabilidad SPEC → evidencia

| Requisitos / criterios | Evidencia de implementación y verificación | Estado |
| --- | --- | --- |
| RF-01 / CA-01.1–01.2 | `src/app.js` resume jugadores, próximos y balance; estado vacío en resumen/plantilla/partidos; flujo de navegador | Conforme |
| RF-02 / CA-02.1–02.5 | `validatePlayer`, formulario de plantilla y borrado; pruebas de dominio | Conforme |
| RF-03 / CA-03.1–03.6 | `validateMatch`, `validateScore`, orden por estado/fecha, formulario, resultado y eliminación; pruebas y flujo de navegador | Conforme |
| RF-04 / CA-04.1–04.6 | `buildStandings` y `standingsTable`; reglas de puntos/desempate en pruebas; 2–1 validado en navegador | Conforme |
| RF-05 / CA-05.1–05.4 | `src/storage.js`, navegación hash y renderizado; round-trip automatizado y recarga real en navegador | Conforme |
| RNF-01, RNF-02, RNF-03, RNF-04, RNF-05 | Interfaz española, módulos nativos, reglas puras, sin dependencias de ejecución, manejo de errores; suite | Conforme |
| RNF-06 | HTML semántico, etiquetas, estado en `aria-live`, foco visible y estilos no dependientes solo del color | Inspección de código; no se ejecutó auditoría automatizada de accesibilidad |

## Límites de esta verificación

- Las pruebas automatizadas cubren dominio y persistencia; no hay suite automatizada de DOM/navegador.
- La revisión de interfaz confirma el flujo principal, no todas las combinaciones visuales ni todos los navegadores.
- Los datos residen en `localStorage`; borrado de datos del sitio implica pérdida, como define la SPEC.
