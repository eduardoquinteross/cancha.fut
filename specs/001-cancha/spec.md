# SPEC — Cancha: gestor de equipo de fútbol amateur

## Estado y objetivo

**Estado: aprobada para el MVP.** Cancha es una aplicación web local para organizar la plantilla y los partidos de un equipo amateur. Su objetivo es que una persona responsable del equipo registre jugadores y resultados, y consulte una tabla calculada de forma consistente sin hojas de cálculo ni cuentas externas.

## Usuarios

- **Responsable del equipo:** administra la plantilla y mantiene calendario y resultados.
- **Integrante del equipo:** consulta el resumen, la plantilla y el rendimiento registrado.

El MVP no distingue permisos: cualquier persona con acceso al navegador puede administrar la información.

## Historias de usuario

- Como responsable, quiero registrar jugadores con su dorsal y posición para consultar la plantilla.
- Como responsable, quiero programar partidos y guardar sus marcadores para mantener el historial.
- Como integrante, quiero ver próximos partidos y resultados recientes para saber qué viene y cómo nos fue.
- Como integrante, quiero consultar la clasificación para entender el rendimiento del equipo.
- Como usuario, quiero que mis cambios sigan allí después de recargar la página en el mismo navegador.

## Requisitos funcionales

### RF-01 — Panel de resumen

- **CA-01.1:** Cuando el usuario abre Cancha, el sistema deberá mostrar el nombre del equipo, cantidad de jugadores, próximos partidos y balance de partidos finalizados.
- **CA-01.2:** Cuando no hay información registrada para una sección, el sistema deberá mostrar un estado vacío comprensible y una acción para añadir el primer elemento cuando aplique.

### RF-02 — Gestión de plantilla

- **CA-02.1:** Cuando el usuario guarda un jugador con nombre válido, dorsal entero entre 1 y 99 y posición permitida, el sistema deberá añadirlo a la plantilla.
- **CA-02.2:** Cuando el nombre está vacío, el dorsal está fuera de rango o ya está asignado, o la posición no es válida, el sistema deberá rechazar el alta, explicar el error y conservar la plantilla sin cambios.
- **CA-02.3:** Cuando se crea un jugador, el sistema deberá permitir las posiciones Portero, Defensa, Mediocampista y Delantero.
- **CA-02.4:** Cuando el usuario elimina un jugador existente, el sistema deberá retirarlo de la plantilla y actualizar el resumen.
- **CA-02.5:** Cuando no hay jugadores, el sistema deberá mostrar un estado vacío de plantilla.

### RF-03 — Gestión de partidos

- **CA-03.1:** Cuando el usuario programa un partido con rival no vacío y fecha válida, el sistema deberá guardarlo con estado programado y condición Local o Visitante.
- **CA-03.2:** Cuando el usuario finaliza un partido con goles enteros iguales o mayores a cero para ambos equipos, el sistema deberá guardar el marcador y cambiar su estado a finalizado.
- **CA-03.3:** Cuando un rival está vacío, la fecha es inválida, un gol no es entero/no negativo o el partido no existe, el sistema deberá rechazar la operación, informar el motivo y conservar los datos anteriores.
- **CA-03.4:** Cuando un partido programado se elimina, el sistema deberá retirarlo sin modificar otros partidos.
- **CA-03.5:** Cuando existen partidos, el sistema deberá mostrar los programados por fecha ascendente y los finalizados del más reciente al más antiguo.
- **CA-03.6:** Cuando no hay partidos, el sistema deberá mostrar un estado vacío con una acción para programar el primero.

### RF-04 — Clasificación

- **CA-04.1:** Cuando se muestra la clasificación, el sistema deberá incluir al equipo local y cada rival que tenga al menos un partido finalizado.
- **CA-04.2:** Cuando un partido finalizado tiene marcador válido, el sistema deberá actualizar para ambos equipos PJ (jugados), PG (ganados), PE (empatados), PP (perdidos), GF (goles a favor), GC (goles en contra), DG (GF−GC) y puntos.
- **CA-04.3:** Cuando un equipo gana, el sistema deberá asignar 3 puntos; en empate, 1 punto a cada uno; en derrota, 0 puntos.
- **CA-04.4:** Cuando varios equipos tienen distinto puntaje, diferencia de goles o goles a favor, el sistema deberá ordenarlos por puntos descendentes, DG descendente, GF descendente y nombre ascendente sin distinguir mayúsculas.
- **CA-04.5:** Cuando dos equipos siguen empatados tras los criterios anteriores, el sistema deberá ordenarlos alfabéticamente por nombre para garantizar un resultado estable.
- **CA-04.6:** Cuando no hay partidos finalizados, la clasificación deberá incluir al equipo local con estadísticas en cero.

### RF-05 — Persistencia y navegación

- **CA-05.1:** Cuando el usuario crea o modifica jugadores o partidos, el sistema deberá guardar el estado actualizado localmente en el navegador.
- **CA-05.2:** Cuando el usuario recarga Cancha en el mismo navegador y origen, el sistema deberá recuperar la información guardada.
- **CA-05.3:** Cuando el almacenamiento contiene JSON ilegible, el sistema deberá mostrar un aviso comprensible y ofrecer iniciar con datos vacíos sin afirmar que los datos previos se recuperaron.
- **CA-05.4:** Cuando el usuario navega entre Inicio, Plantilla, Partidos y Tabla, el sistema deberá mostrar la sección elegida sin perder el estado guardado.

## Requisitos no funcionales

- **RNF-01:** Interfaz y mensajes dirigidos al usuario en español; diseño adaptable a móvil y escritorio.
- **RNF-02:** La aplicación debe funcionar en navegadores modernos sin backend, cuenta ni conexión de red para sus funciones principales.
- **RNF-03:** La lógica de dominio será independiente del DOM y de `localStorage`.
- **RNF-04:** El código de ejecución no tendrá dependencias externas; pruebas con `node --test`.
- **RNF-05:** Operaciones inválidas no deben corromper ni reemplazar el último estado válido.
- **RNF-06:** La interfaz debe tener etiquetas accesibles, controles con foco visible y mensajes de estado que no dependan únicamente del color.

## Casos límite

- Dorsales repetidos no se aceptan; dorsal 1 y 99 sí.
- Goles 0–0 son válidos; valores negativos, decimales, vacíos o no numéricos no lo son.
- Partidos programados no cuentan para PJ, puntos ni goles.
- Un rival se agrega a la clasificación solo después de un partido finalizado.
- Un partido del equipo contra sí mismo no es válido.
- Variaciones de mayúsculas/minúsculas en el nombre del rival se consideran el mismo equipo para estadísticas.
- Tabla sin partidos finalizados muestra al equipo local con cero en todas las estadísticas.
- Datos inválidos en formularios no borran entradas válidas ya guardadas.
- Datos locales corruptos no se presentan como si fueran válidos.

## Fuera de alcance

- Inicio de sesión, permisos, backend, nube, sincronización y multi-equipo.
- Crear/editar/eliminar ligas o configurar reglas de puntuación.
- Alineaciones, entrenamientos, asistencia, lesiones, tarjetas, goleadores y estadísticas individuales.
- Carga de escudos o fotografías.
- Notificaciones, calendario externo y compartir/publicar resultados.
- Importar o exportar CSV/JSON.

## Criterios de finalización

- RF-01 a RF-05 y sus criterios CA están implementados y trazados a pruebas.
- Plantilla, partidos, tabla calculada, persistencia local y navegación funcionan en el navegador.
- Validaciones previenen dorsales duplicados, entradas inválidas y marcadores negativos.
- `node --test` pasa; comprobación de interfaz manual documentada para móvil y escritorio.
- `README.md` explica propósito, ejecución, pruebas, límites y riesgos de persistencia local.
