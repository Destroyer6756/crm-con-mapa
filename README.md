# CloudOps Dashboard

> Plataforma profesional para planificar, analizar y visualizar infraestructura Cloud basada en AWS  
> *Cloud Foundations – Semanas 5 y 6 – Práctica Integrativa*

---

## 📋 Descripción

**CloudOps Dashboard** es una aplicación web React completamente funcional que simula un panel de control de operaciones Cloud empresarial. Permite visualizar, planificar, analizar y gestionar una infraestructura Cloud multi-región basada en servicios AWS mediante datos simulados (mock) y una interfaz de usuario moderna.

## 🎯 Objetivo

Demostrar comprensión integral de los fundamentos de Cloud Computing (AWS), incluyendo:
- Gestión de regiones e infraestructura global
- Planificación y diseño de soluciones Cloud
- Estimación y control de costos
- Seguridad y modelo de responsabilidad compartida
- Arquitectura de red en la nube
- Catálogo de servicios AWS

---

## 🛠 Tecnologías

| Tecnología       | Uso                                      |
|------------------|------------------------------------------|
| React 18         | Framework UI                             |
| TypeScript       | Tipado estático                          |
| Vite             | Build tool / Dev server                  |
| Tailwind CSS v4  | Estilos utilitarios                      |
| React Router v6  | Enrutamiento SPA                         |
| Recharts         | Gráficos interactivos                    |
| Leaflet + React-Leaflet | Mapa mundial interactivo         |
| Lucide React     | Iconografía                              |
| localStorage     | Persistencia de datos del cliente        |

---

## 🚀 Instalación y Ejecución

```bash
# 1. Entrar al directorio del proyecto
cd cloudops-dashboard

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

---

## 📁 Estructura del Proyecto

```
cloudops-dashboard/
├── public/
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── Header.tsx         # Header con búsqueda, región, dark mode
│   │   ├── Sidebar.tsx        # Navegación lateral con NavLink activo
│   │   ├── StatCard.tsx       # Tarjetas KPI con tendencia
│   │   ├── ServiceCard.tsx    # Tarjetas de servicios AWS
│   │   ├── SecurityCard.tsx   # Tarjetas de seguridad con barra de puntuación
│   │   ├── StatusBadge.tsx    # Badge de estado con colores
│   │   ├── Modal.tsx          # Modal genérico reutilizable
│   │   ├── NotificationToast.tsx # Sistema de notificaciones toast
│   │   ├── WorldMap.tsx       # Mapa mundial interactivo con Leaflet
│   │   └── NetworkDiagram.tsx # Diagrama de arquitectura de red SVG
│   ├── data/                  # Datos simulados
│   │   ├── awsServices.ts     # Catálogo de 14 servicios AWS
│   │   ├── regions.ts         # 10 regiones AWS + Lima como origen
│   │   ├── routes.ts          # 12 rutas inter-región
│   │   ├── costs.ts           # Items de costo + evolución mensual
│   │   ├── security.ts        # Items de seguridad + IAM summary
│   │   └── network.ts         # Nodos de red + security groups
│   ├── hooks/                 # Custom React hooks
│   │   ├── useLocalStorage.ts # Hook para persistencia en localStorage
│   │   └── useNotifications.ts# Hook para sistema de notificaciones
│   ├── pages/                 # Páginas de la aplicación
│   │   ├── Dashboard.tsx      # Dashboard principal con KPIs y gráficos
│   │   ├── Planning.tsx       # CRUD de propuestas Cloud
│   │   ├── Costs.tsx          # Estimación y gestión de costos
│   │   ├── Infrastructure.tsx # Infraestructura global con mapa
│   │   ├── Security.tsx       # Dashboard de seguridad
│   │   ├── Network.tsx        # Arquitectura de red interactiva
│   │   └── Services.tsx       # Catálogo de servicios AWS
│   ├── types/
│   │   └── cloud.ts           # Interfaces y tipos TypeScript
│   ├── App.tsx                # Router principal + layout global
│   ├── main.tsx               # Entry point React
│   └── index.css              # Estilos globales + design tokens
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 📊 Módulos y Funcionalidades

### 🏠 Dashboard (`/dashboard`)
- **7 tarjetas KPI** calculadas dinámicamente desde datos: Servicios, Región, Costo mensual, Costo anual, Recursos, Seguridad, Arquitectura
- **Gráfico de área** de evolución de costos mensual (10 meses)
- **Gráfico de dona** de distribución de costos por servicio
- **Gráfico de barras** de comparativa de costos
- Tabla de regiones activas con estado
- Resumen de seguridad con barras de progreso

### 🗺 Planificación Cloud (`/planning`)
- Formulario completo con validación
- Campos: nombre, tipo de app, descripción, región AWS, usuarios estimados, disponibilidad, servicios múltiples, objetivo
- **Selección múltiple** de 13 servicios AWS
- CRUD completo: Crear, Ver, Editar, Eliminar propuestas
- **Persistencia en localStorage** — sobrevive recarga de página
- Notificaciones de éxito/error

### 💰 Costos (`/costs`)
- **Calculadora de costos** en tiempo real: `Mensual = cantidad × horas × precio`
- **Vista previa en vivo** del cálculo al editar
- CRUD de items de costo con precios pre-configurados por servicio
- Tabla con porcentaje de participación por servicio
- Gráfico de distribución (dona) y comparativa (barras)
- KPIs: costo mensual total, anual, servicio más costoso
- **Persistencia en localStorage**

### 🌍 Infraestructura Global (`/infrastructure`)
- **Mapa mundial interactivo** con Leaflet (no imagen estática)
- **9 regiones AWS marcadas** + Lima como punto de origen
- **12 rutas inter-región** con información de latencia y tráfico
- **Paquetes de tráfico animados** que se mueven sobre las rutas en tiempo real
- Panel lateral con detalles al hacer clic en una región
- Filtros: estado, servicio, mostrar/ocultar tráfico
- Leyenda interactiva
- Tabla de regiones con disponibilidad y tabla de rutas

### 🔒 Seguridad (`/security`)
- **Puntuación global** calculada como promedio de todos los controles
- **Radar chart** de postura de seguridad multi-dimensión
- **8 tarjetas de control** de seguridad (IAM, MFA, Firewall, Backup, etc.)
- Tabs: Controles / IAM & Identidad / Responsabilidad Compartida
- Dashboard IAM con usuarios, roles, políticas, MFA status
- **Modelo de responsabilidad compartida** AWS vs Cliente

### 🌐 Arquitectura de Red (`/network`)
- **Diagrama interactivo SVG** construido con componentes React
- Nodos clickeables: Internet → Route 53 → CloudFront → IGW → ALB → EC2 × 2 → RDS
- **Conexiones animadas SVG** con puntos en movimiento
- Límites de VPC, subredes públicas y privadas visibles
- Panel de detalles al hacer clic en cada nodo
- Tabla de security groups configurados

### ☁️ Servicios AWS (`/services`)
- **Catálogo de 14 servicios** AWS con íconos y categorías
- Buscador en tiempo real por nombre y descripción
- Filtros por **categoría** y **estado**
- Chips de categoría para navegación rápida
- Tarjetas con: nombre, categoría, descripción, función principal, barra de utilización, estado

---

## 🗺 Mapa Mundial Interactivo

El mapa usa **React Leaflet + Leaflet.js** con tiles de OpenStreetMap estilizados:

### Regiones AWS incluidas:
| Región | Código | Ubicación |
|--------|--------|-----------|
| North Virginia | us-east-1 | Virginia, USA |
| Ohio | us-east-2 | Ohio, USA |
| Oregon | us-west-2 | Oregon, USA |
| Ireland | eu-west-1 | Dublin, Irlanda |
| Frankfurt | eu-central-1 | Frankfurt, Alemania |
| Tokyo | ap-northeast-1 | Tokio, Japón |
| Singapore | ap-southeast-1 | Singapur |
| São Paulo | sa-east-1 | São Paulo, Brasil |
| Sydney | ap-southeast-2 | Sídney, Australia |
| **Lima (Origen)** | PE-LIMA | Lima, Perú |

### Rutas principales:
```
Lima → São Paulo → North Virginia → Ireland → Frankfurt → Tokyo
Oregon → Tokyo → Singapore → Sydney
North Virginia → Ohio → Oregon
North Virginia → Oregon (directo)
```

### Funcionalidades del mapa:
- ✅ Marcadores de región con colores por estado
- ✅ Líneas de rutas entre regiones
- ✅ Animación de paquetes de datos en movimiento
- ✅ Tooltips informativos al pasar el cursor
- ✅ Panel lateral de detalles al hacer clic en región
- ✅ Filtros por estado y servicio
- ✅ Toggle de tráfico animado (activar/desactivar)
- ✅ Leyenda de colores y símbolos
- ✅ Zoom interactivo

---

## 🎨 Diseño

### Paleta de colores:
| Token | Color | Uso |
|-------|-------|-----|
| Principal | `#2563EB` | Acciones, navegación activa |
| Seguridad | `#16A34A` | Estado operativo, seguridad |
| Costos | `#F59E0B` | Advertencias, costos |
| Alertas | `#DC2626` | Errores, críticos |
| Sidebar | `#0F172A` | Fondo sidebar |
| BG Main | `#F8FAFC` (claro) / `#0F172A` (oscuro) | Fondo principal |

### Modo oscuro:
- Toggle en el header
- Persiste en localStorage
- Toda la interfaz se adapta mediante CSS variables
- Notificación de confirmación al cambiar

---

## 📱 Responsive Design

| Pantalla | Comportamiento |
|----------|----------------|
| Desktop (≥1024px) | Sidebar visible permanente, grid completo |
| Tablet (768–1023px) | Sidebar adaptable, grids de 2 columnas |
| Móvil (<768px) | Sidebar hamburger desplegable, columna única |
| Tablas | Scroll horizontal en pantallas pequeñas |
| Mapa | Se adapta al contenedor responsivo |
| Gráficos | ResponsiveContainer de Recharts |

---

## 💾 Persistencia (localStorage)

| Clave | Contenido |
|-------|-----------|
| `cloudops-dark-mode` | Estado del modo oscuro |
| `cloudops-region` | Región seleccionada en el header |
| `cloudops-proposals` | Propuestas Cloud guardadas |
| `cloudops-costs` | Items de costo personalizados |

---

## 🔔 Sistema de Notificaciones

Las notificaciones toast aparecen automáticamente en la esquina inferior derecha:
- ✅ **Success** (verde): propuesta guardada, servicio agregado
- ⚠️ **Warning** (amarillo): servicio eliminado, propuesta eliminada
- ❌ **Error** (rojo): validación fallida
- ℹ️ **Info** (azul): cambio de modo oscuro, región seleccionada

Se auto-eliminan después de 4 segundos.

---

## ✅ Checklist de Funcionalidades

- [x] npm install funciona
- [x] npm run dev funciona
- [x] Sin errores de TypeScript
- [x] Todas las rutas funcionan
- [x] Sidebar con estado activo
- [x] Dashboard con KPIs calculados
- [x] Planning con CRUD completo
- [x] Costos con cálculo en tiempo real
- [x] Infraestructura con mapa interactivo
- [x] Seguridad con radar y controles
- [x] Red con diagrama SVG interactivo
- [x] Servicios con búsqueda y filtros
- [x] Formulario con validación
- [x] Gráficos Recharts funcionan
- [x] Mapa Leaflet funciona
- [x] Regiones y rutas en el mapa
- [x] Animación de tráfico de datos
- [x] Filtros del mapa funcionan
- [x] Modales funcionan
- [x] localStorage persiste datos
- [x] Modo oscuro completo
- [x] Responsive para móvil/tablet/desktop
- [x] Notificaciones toast
- [x] Animaciones suaves

---

## 📸 Capturas Sugeridas

1. **Dashboard** — vista completa con KPIs y gráficos
2. **Mapa Mundial** — con regiones marcadas y rutas animadas
3. **Planificación** — formulario de nueva propuesta
4. **Costos** — tabla + gráficos de distribución
5. **Seguridad** — radar chart + tarjetas de controles
6. **Red** — diagrama SVG con VPC y nodos interactivos
7. **Servicios** — grid de tarjetas filtradas

---

*Desarrollado como práctica académica – Cloud Foundations – Semanas 5 y 6*
