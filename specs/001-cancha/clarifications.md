# Aclaraciones y decisiones — Cancha MVP

Las decisiones siguientes delimitan el MVP para que se pueda construir y probar sin depender de servicios externos.

| ID | Decisión | Motivo |
| --- | --- | --- |
| DA-01 | Cancha administra un solo equipo local, sin cuentas ni varios clubes. | Mantener el uso inmediato y el modelo sencillo. |
| DA-02 | El equipo actual es el rival implícito de cada partido; se registran rival, fecha y condición local/visitante. | No se administra una liga externa. |
| DA-03 | Los partidos admiten estados programado y finalizado; solo los finalizados con marcador válido afectan la tabla. | Separar agenda de estadísticas reales. |
| DA-04 | Desempate de tabla: puntos, diferencia de goles, goles a favor y nombre del equipo en orden alfabético. | Resultado determinista sin reglas de torneo configurables. |
| DA-05 | El equipo del usuario se identifica con un nombre fijo editable en el código de datos inicial; no se incluye configuración de perfil en el MVP. | Evitar opciones de configuración no esenciales. |
| DA-06 | Los datos se guardan en el navegador actual con `localStorage`; no hay sincronización ni recuperación tras borrar los datos del sitio. | Alcance local y sin backend. |
| DA-07 | Eliminar un jugador o partido se aplica inmediatamente, sin confirmación. | Interacciones mínimas para un prototipo educativo. |
| DA-08 | La fecha de partido se valida y compara como fecha calendario local `AAAA-MM-DD`. | Evitar ambigüedad de zona horaria y hora. |

No se incorporan funciones de alineaciones, asistencia, estadísticas individuales ni autenticación.
