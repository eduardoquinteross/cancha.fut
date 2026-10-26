# PLAN — Cancha MVP

Este plan traduce la SPEC aprobada en una solución técnica sin añadir comportamiento. No se usan frameworks ni dependencias de ejecución (Constitución 1). Identificadores de código en inglés e interfaz en español.

## Arquitectura y módulos

| Módulo | Responsabilidad | Trazabilidad |
| --- | --- | --- |
| `src/domain.js` | Validar jugadores/partidos; derivar tabla y resumen con funciones puras. No accede a DOM, reloj ni almacenamiento. | RF-02, RF-03, RF-04; CA-02.1–02.3, CA-03.1–03.3, CA-04.1–04.5 |
| `src/storage.js` | Leer, validar versión y guardar estado en `localStorage`; devolver resultados/errores explícitos. | RF-05; CA-05.1–05.3 |
| `src/app.js` | Estado de aplicación, navegación, renderizado seguro, eventos y mensajes. Coordina dominio y almacenamiento. | RF-01–RF-05; CA-01.*, CA-02.4–02.5, CA-03.4–03.6, CA-04.6, CA-05.4 |
| `index.html` | Estructura semántica y formularios accesibles. | RNF-01, RNF-06 |
| `styles.css` | Diseño visual responsive y estados de foco/validación. | RNF-01, RNF-06 |
| `tests/domain.test.mjs` | Pruebas deterministas de validación, clasificación y resumen. | Todos los CA de dominio |
| `tests/storage.test.mjs` | Persistencia, JSON inválido, versión y fallos de almacenamiento con adaptador simulado. | CA-05.1–05.3 |

## Modelo de datos

Versión persistida bajo la clave `cancha:data:v1`. El estado mínimo:

```json
{
  "version": 1,
  "teamName": "Atlético del Barrio",
  "players": [
    { "id": "p-1", "name": "Lucía Pérez", "number": 10, "position": "Mediocampista" }
  ],
  "matches": [
    { "id": "m-1", "opponent": "Los Pinos", "date": "2026-10-25", "venue": "Local", "status": "finished", "teamGoals": 2, "opponentGoals": 1 }
  ]
}
```

`status` admite `scheduled` o `finished`; los goles solo son necesarios en partidos finalizados. Los IDs son estables y únicos. Se comparan rivales normalizando espacios exteriores y mayúsculas, manteniendo el nombre ingresado para presentación. La racha/tabla no se persiste: se deriva de los partidos.

## Reglas de dominio

```text
buildStandings(teamName, matches):
  crear equipo local con estadísticas en cero
  para cada partido finalizado:
    resolver rival por nombre normalizado; si no existe, añadirlo con cero
    incrementar PJ y GF/GC para equipo y rival
    asignar PG/PE/PP según marcador y sumar 3/1/0 puntos
  para cada fila: DG = GF - GC
  ordenar por Puntos desc, DG desc, GF desc, nombre normalizado asc
  devolver filas
```

Todas las funciones reciben datos ya validados y devuelven nuevas estructuras (sin mutar el estado de entrada). Fechas se validan estrictamente como día calendario ISO local.

## Contrato de persistencia

- `loadState(storage)`: si no hay clave, devuelve estado inicial; si JSON válido y versión compatible, devuelve datos; si corrupto/versión no soportada, devuelve error recuperable y no lo sobrescribe silenciosamente.
- `saveState(state, storage)`: serializa estado validado y captura errores de cuota/seguridad. El UI confirma solo luego de un guardado exitoso.
- El adaptador `storage` facilita pruebas; la aplicación usa `window.localStorage`.
- Los datos solo viven en este perfil/origen. Borrar datos del sitio los elimina; no hay copia remota.

## Decisiones técnicas

| Decisión | Alternativa descartada | Razón | RF/RNF |
| --- | --- | --- | --- |
| HTML/CSS/JS modular nativo servido como estático. | React/Vue y cadena de compilación. | Arranque y mantenimiento simples, sin dependencias. | RNF-02, RNF-04 |
| `localStorage` versionado. | IndexedDB, base remota o servidor. | El modelo es pequeño y síncrono; basta para el alcance local explícito. | RF-05, RNF-02 |
| Derivar tabla desde partidos finalizados. | Guardar estadísticas agregadas. | Evita inconsistencias al quitar partidos y facilita auditar reglas. | RF-04 |
| Identificadores estables y validación central en dominio. | Usar índices de arreglo / validar solo en formularios. | Borrados no cambian referencias; reglas son verificables fuera del UI. | RF-02–RF-05 |
| Node built-in test runner. | Framework externo de pruebas. | Tests de dominio/storage sin añadir dependencia. | RNF-04 |

## Estrategia de pruebas y trazabilidad

- **Unidad dominio:** validación de dorsal 1/99, duplicado, posición, rival vacío/propio, fechas, goles 0 y rechazo de negativo/decimal; cálculo de victoria/empate/derrota, desempates y exclusión de programados. Cubre RF-02–RF-04.
- **Unidad almacenamiento:** estado inicial, round-trip, JSON corrupto, versión inválida, error de lectura/escritura sin falso éxito. Cubre RF-05.
- **Verificación de UI:** navegación, formularios, vacíos, mensajes, render de resumen/plantilla/partidos/tabla; teclado/foco y viewport móvil/escritorio. Cubre RF-01–RF-05 y RNF-01/RNF-06.
- Ejecutar `node --test`. La revisión manual de UI se registra como manual; no se afirma una cobertura automática de navegador que no existe.
