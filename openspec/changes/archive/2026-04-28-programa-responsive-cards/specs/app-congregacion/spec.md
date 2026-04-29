## ADDED Requirements

### Requirement: Layout responsive del programa — cards en mobile
El sistema SHALL mostrar las filas del programa como cards apiladas en pantallas mobile (`< md`), y como tabla de dos columnas en desktop (`md+`).

#### Scenario: Mobile muestra card con tema destacado y asignado visible
- **WHEN** un usuario accede al programa desde mobile
- **THEN** cada parte se muestra como una card con borde lateral del color de sección, tema como texto principal, y nombre del asignado + asistente debajo de una línea separadora

#### Scenario: Desktop mantiene layout de tabla sin cambios
- **WHEN** un usuario accede al programa desde desktop
- **THEN** el layout de tabla de dos columnas (Parte / Asignado) se muestra sin cambios

#### Scenario: Botón de edición accesible en mobile
- **WHEN** un admin accede al programa desde mobile
- **THEN** el botón de edición aparece en la esquina superior derecha de cada card
