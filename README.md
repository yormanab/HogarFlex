# HogarFlex Noeluis — Sistema de Créditos y Ventas

Sistema web para la administración y control de créditos, ventas al contado, cobranzas e inventario para HogarFlex Noeluis.

## 🚀 Funcionalidades principales

- **Dashboard General:** Métricas de cobro mensual, pendiente por cobrar, clientes activos, gráficos de ingresos por semana y últimos 6 meses, y panel de créditos con cuotas vencidas en mora con botón directo de cobro.
- **Gestión de Clientes:** Registro, búsqueda, historial crediticio y perfil detallado de cada cliente.
- **Inventario y Productos:** Control de catálogo, fotos, precios de contado y crédito con margen de ganancia configurable.
- **Gestión de Créditos:** Creación de créditos con cálculo automático de cuota inicial (USD y Bs), periodicidad (semanal, quincenal, mensual) y cuotas fijas.
- **Módulo de Pagos:** Cobro cuota a cuota o abonos libres que redistribuyen el saldo automáticamente. Soporte de pagos mixtos en Divisas ($ USD) y Bolívares (Bs.) con tasa oficial BCV del día.
- **Facturación y Recibos:** Generación, previsualización, impresión y descarga de comprobantes y facturas en formato PDF estándar.
- **Respaldo en la Nube:** Exportación directa a Google Sheets (`HogarFlex_DB`) y respaldo de fotos de comprobantes en Google Drive (`HogarFlex_Comprobantes`).
- **Modo PWA / Offline:** Service Worker y Web App Manifest para instalación en dispositivos móviles y funcionamiento sin conexión.

## 💻 Tecnologías
- HTML5 / CSS3 / JavaScript (Vanilla)
- jsPDF (Renderizado local de documentos PDF)
- Google Identity Services & Google APIs (Drive & Sheets)
- Service Worker API (Caché y PWA)
