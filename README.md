# Banisi - Sistema de Aprobación de Préstamos Online

Sistema digital integral para solicitudes de préstamos con evaluación automática de reglas de aprobación.

## 🚀 Características Principales

- **Solicitud de Préstamo 100% Digital**: Formulario intuitivo y completo para solicitar préstamos
- **Evaluación Automática de Reglas**: Sistema de reglas configurables para aprobar/rechazar automáticamente
- **Panel Administrativo**: Gestión completa de solicitudes y reglas de aprobación
- **Cálculo de Préstamos**: Simulador de montos y cuotas en tiempo real
- **Autenticación de Seguridad**: CAPTCHA y verificación de identidad
- **Interfaz Responsiva**: Diseño adaptable a todos los dispositivos

---

## 📋 Requisitos Previos

- **Node.js**: v18 o superior
- **Bun**: v1.0 o superior (gestor de paquetes)
- **Git**: Para control de versiones

---

## 🛠️ Instalación y Levantamiento

### 1. Clonar el repositorio

```bash
git clone https://github.com/Josue-Caballero/bank-flow-design.git
cd loan-aproval
```

### 2. Instalar dependencias

```bash
bun install

npm install

```

### 3. Iniciar el servidor de desarrollo

```bash
bun run dev
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 4. Build para producción

```bash
bun run build

npm run build
```

---


## 🎯 Secciones de la Aplicación

### 1. **Página de Inicio** (`/`)
- Presentación del banco y sus servicios
- Botones de navegación hacia solicitud de préstamo
- Información general sobre productos

### 2. **Solicitud de Préstamo** (`/solicitud`)
Formulario paso a paso para solicitar un préstamo:

#### Paso 1: Información Personal
- Nombre completo
- Número de identidad
- Correo electrónico
- Teléfono

#### Paso 2: Información de Trabajo
- Tipo de trabajo (Independiente/Asalariado)
- Ingreso mensual
- Años en el trabajo actual
- Empresa/Negocio

#### Paso 3: Información del Préstamo
- Tipo de préstamo (Personal/Auto/Educativo)
- Monto solicitado (con calculadora)
- Plazo en meses
- Propósito del préstamo

#### Paso 4: Información Personal Adicional
- Estado civil
- Dirección completa
- Referencias personales

#### Paso 5: Documentación
- Cédula de identidad
- Comprobante de ingresos
- Foto de perfil

#### Paso 6: Verificación de Seguridad
- CAPTCHA de verificación
- Resumen de información
- Aceptación de términos y condiciones

### 3. **Panel Administrativo** (`/admin`)

#### 3.1 Dashboard Administrativo
- Resumen de solicitudes
- Estadísticas de aprobación/rechazo
- Acciones rápidas

#### 3.2 Lista de Solicitudes
- Tabla con todas las solicitudes de préstamo
- Filtros por estado (pendiente, aprobada, rechazada)
- Búsqueda por nombre/ID
- Acciones: ver detalles, aprobar, rechazar

#### 3.3 Detalle de Solicitud
- Información completa del solicitante
- Documentos adjuntos
- Historial de cambios
- Notas de evaluación
- Opciones para aprobar/rechazar/requerir información

#### 3.4 Configuración de Reglas Automáticas
Gestión completa de reglas de aprobación automática:

**Crear Nueva Regla**
- Nombre y descripción
- Prioridad (P0, P1, P2, P3)
- Condiciones configurables:
  - Campo: Seleccionar de (Cliente Existente, Score Crediticio, Monto, Tipo de Préstamo, etc.)
  - Operador: Igual a, Mayor que, Menor que, Entre, En la lista, No en la lista
  - Valor: Especificar el valor de comparación
- Tipo de acción:
  - Aprobar Automáticamente (con monto máximo opcional)
  - Rechazar Automáticamente (con razón)
  - Requerir Revisión Manual (con nota)

**Editar Regla Existente**
- Modificar todos los parámetros de la regla
- Agregar/eliminar condiciones
- Cambiar acciones

**Eliminar Regla**
- Confirmación de eliminación
- Prevención de eliminación accidental

**Gestión de Reglas**
- Activar/Desactivar reglas
- Ver todas las reglas activas
- Ordenamiento por prioridad
- Indicadores visuales de estado

---


## 🎨 Colores Principales

- **Primario (Magenta Banco)**: `#d946a6`
- **Secundario (Azul)**: `#3b82f6`
- **Neutro Claro**: `#f3f4f6`
- **Neutro Oscuro**: `#1f2937`

---

**Última actualización**: Noviembre 2025
