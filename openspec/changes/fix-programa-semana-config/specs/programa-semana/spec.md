## REMOVED Requirements

### Requirement: lector_tesoros
**Reason**: No existe como parte separada en la reunión real
**Migration**: Eliminar del config y seed

### Requirement: mejores_maestros
**Reason**: No corresponde a ninguna parte real del programa
**Migration**: Eliminar del config y seed

## ADDED Requirements

### Requirement: lectura_biblia
Parte de estudiante en sección tesoros. Lectura de la Biblia (4 min). Tiene sala, tiene tema, NO tiene asistente.

#### Scenario: Lectura asignada
- **WHEN** admin asigna lectura_biblia
- **THEN** puede seleccionar publicador, sala y tema (pasaje bíblico)

### Requirement: lector_estudio
Lector del estudio bíblico de la congregación en sección nvc. Sin tema, sin asistente.

#### Scenario: Lector asignado
- **WHEN** admin asigna lector_estudio
- **THEN** puede seleccionar un anciano o siervo ministerial

### Requirement: oracion_final
Hermano designado para la oración de cierre. Sección cierre, sin tema.

#### Scenario: Oración asignada
- **WHEN** admin asigna oracion_final
- **THEN** puede seleccionar un anciano o siervo ministerial
