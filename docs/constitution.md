# Constitución del proyecto Cancha

1. **Stack liviano:** HTML, CSS y JavaScript nativos; sin frameworks ni dependencias de ejecución.
2. **SDD primero:** ningún cambio de comportamiento se implementa sin actualizar y aprobar la SPEC.
3. **Dominio independiente:** reglas de clasificación y validación no dependen del DOM ni del almacenamiento.
4. **Calidad verificable:** cada regla de dominio tiene pruebas automatizadas; `node --test` debe pasar antes de cerrar.
5. **Datos locales explícitos:** persistir en `localStorage`; cambios al esquema requieren actualizar primero SPEC y PLAN.
6. **Idioma coherente:** identificadores en inglés; interfaz, documentación y mensajes para el usuario en español.
