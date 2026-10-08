const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CAPTURAS_DIR = path.join(__dirname, 'capturas');
const OUTPUT_PDF = path.join(__dirname, 'HogarFlex_Guia_Cliente_Yorgelis.pdf');

function getImageBase64(imgName) {
  const p = path.join(CAPTURAS_DIR, imgName);
  if (fs.existsSync(p)) {
    const data = fs.readFileSync(p);
    return `data:image/png;base64,${data.toString('base64')}`;
  }
  return '';
}

async function generateGuiaYorgelis() {
  console.log('Generando Guía de Cliente para Yorgelis...');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>HogarFlex — Guía Completa de la Aplicación</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap');

    @page {
      size: A4;
      margin: 16mm 14mm 16mm 14mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.55;
      font-size: 9.5pt;
    }

    .page-break {
      page-break-before: always;
    }

    .avoid-break {
      page-break-inside: avoid;
    }

    /* Portada de Yorgelis */
    .cover-wrap {
      min-height: 960px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 50px 36px;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
      color: #ffffff;
      border-radius: 16px;
    }

    .cover-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .cover-pill {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      padding: 8px 18px;
      border-radius: 30px;
      font-size: 8.5pt;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #f8fafc;
    }

    .cover-heart {
      font-size: 20pt;
    }

    .cover-center {
      margin: 60px 0;
    }

    .cover-brand {
      font-family: 'Outfit', sans-serif;
      font-size: 46pt;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.05;
      margin-bottom: 14px;
      letter-spacing: -1px;
    }

    .cover-sub {
      font-size: 16pt;
      font-weight: 500;
      color: #c7d2fe;
      margin-bottom: 25px;
      line-height: 1.35;
    }

    .cover-desc-box {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 22px;
      max-width: 540px;
      line-height: 1.6;
      font-size: 10pt;
      color: #e0e7ff;
    }

    .cover-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      padding-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 9pt;
      color: #cbd5e1;
    }

    /* Índice */
    .toc-title {
      font-family: 'Outfit', sans-serif;
      font-size: 20pt;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 8px;
      border-bottom: 3px solid #6366f1;
      padding-bottom: 8px;
    }

    .toc-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      margin-top: 20px;
    }

    .toc-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      transition: all 0.2s;
    }

    .toc-item-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .toc-icon {
      font-size: 14pt;
    }

    .toc-name {
      font-weight: 700;
      font-size: 9.5pt;
      color: #1e293b;
    }

    .toc-desc {
      font-size: 8pt;
      color: #64748b;
    }

    /* Cabecera de páginas */
    .guide-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 8px;
      margin-bottom: 18px;
      font-size: 8pt;
      color: #64748b;
      font-weight: 600;
    }

    /* Capítulos */
    .chapter-hero {
      margin-bottom: 16px;
    }

    .chapter-tag {
      display: inline-block;
      font-size: 7.5pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #4f46e5;
      background: #eef2ff;
      padding: 4px 10px;
      border-radius: 20px;
      margin-bottom: 6px;
    }

    .chapter-title {
      font-family: 'Outfit', sans-serif;
      font-size: 18pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.25;
      margin-bottom: 8px;
    }

    .chapter-intro {
      font-size: 9.5pt;
      color: #475569;
      line-height: 1.55;
    }

    /* Bloques de pasos */
    .steps-container {
      margin: 14px 0;
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .step-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #6366f1;
      border-radius: 8px;
      padding: 10px 14px;
    }

    .step-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 9pt;
      color: #0f172a;
      margin-bottom: 4px;
    }

    .step-badge {
      background: #6366f1;
      color: #ffffff;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 7.5pt;
      font-weight: 800;
    }

    .step-body {
      font-size: 8.5pt;
      color: #475569;
      line-height: 1.45;
    }

    /* Tarjeta de imagen grande */
    .img-box {
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      background: #0f172a;
      padding: 8px;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
      margin-top: 14px;
      text-align: center;
    }

    .img-box img {
      width: 100%;
      max-height: 410px;
      object-fit: contain;
      border-radius: 6px;
      display: block;
      margin: 0 auto;
    }

    .img-caption {
      font-size: 8pt;
      color: #cbd5e1;
      margin-top: 6px;
      font-weight: 600;
    }

    .tip-box {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      border-radius: 8px;
      padding: 10px 14px;
      margin-top: 12px;
      font-size: 8.5pt;
      color: #065f46;
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    /* Contraportada */
    .back-cover {
      min-height: 960px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 50px 40px;
      border-radius: 16px;
      background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
      border: 2px solid #e0e7ff;
      text-align: center;
    }

    .support-card {
      background: #ffffff;
      border: 2px dashed #6366f1;
      border-radius: 14px;
      padding: 28px;
      margin: 30px auto;
      max-width: 500px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
      text-align: left;
    }
  </style>
</head>
<body>

  <!-- ==================== PORTADA ==================== -->
  <div class="cover-wrap">
    <div class="cover-top">
      <div class="cover-pill">Manual de Operación Oficial</div>
      <div class="cover-heart">❤️</div>
    </div>

    <div class="cover-center">
      <h1 class="cover-brand">HogarFlex</h1>
      <h2 class="cover-sub">Tu Sistema de Gestión Inteligente</h2>
      <div class="cover-desc-box">
        Bienvenida a tu guía paso a paso. Este documento fue diseñado especialmente para ti, con explicaciones claras, sencillas y todas las capturas visuales de tu aplicación para que aproveches cada función al máximo.
      </div>
    </div>

    <div class="cover-bottom">
      <div>
        <p style="font-size: 8pt; text-transform: uppercase; letter-spacing: 1px; color: #a5b4fc; font-weight: 700;">Dedicado a</p>
        <p style="font-size: 13pt; font-weight: 800; color: #ffffff;">Yorgelis Silva</p>
      </div>
      <div style="text-align: right;">
        <p style="font-size: 8pt; text-transform: uppercase; letter-spacing: 1px; color: #a5b4fc; font-weight: 700;">Edición</p>
        <p style="font-size: 11pt; font-weight: 700; color: #ffffff;">Octubre 2026 — SW v24</p>
      </div>
    </div>
  </div>

  <!-- ==================== ÍNDICE ==================== -->
  <div class="page-break"></div>
  <div class="guide-header">
    <span>HogarFlex — Guía de la Cliente</span>
    <span>Contenido General</span>
  </div>

  <h2 class="toc-title">📖 Índice de Capítulos</h2>
  <p style="color: #64748b; font-size: 9pt; margin-bottom: 16px;">
    Consulta de forma rápida cada una de las 12 herramientas diseñadas para tu negocio:
  </p>

  <div class="toc-grid">
    <div class="toc-item">
      <div class="toc-item-left">
        <span class="toc-icon">🔐</span>
        <div>
          <div class="toc-name">Capítulo 1 — Acceso a la Aplicación</div>
          <div class="toc-desc">Inicio de sesión seguro, credenciales y salida</div>
        </div>
      </div>
      <span style="font-weight: 700; color: #6366f1;">Pág. 3</span>
    </div>
    <div class="toc-item">
      <div class="toc-item-left">
        <span class="toc-icon">📊</span>
        <div>
          <div class="toc-name">Capítulo 2 — Panel Principal (Dashboard)</div>
          <div class="toc-desc">Interpretación de métricas de clientes, capital y cobros</div>
        </div>
      </div>
      <span style="font-weight: 700; color: #6366f1;">Pág. 4</span>
    </div>
    <div class="toc-item">
      <div class="toc-item-left">
        <span class="toc-icon">👥</span>
        <div>
          <div class="toc-name">Capítulo 3 — Gestión de Clientes</div>
          <div class="toc-desc">Registro de clientes, perfiles, búsqueda y edición</div>
        </div>
      </div>
      <span style="font-weight: 700; color: #6366f1;">Págs. 5–6</span>
    </div>
    <div class="toc-item">
      <div class="toc-item-left">
        <span class="toc-icon">💳</span>
        <div>
          <div class="toc-name">Capítulo 4 — Financiamiento y Créditos</div>
          <div class="toc-desc">Creación de crédito, plan de cuotas y registro de cobros</div>
        </div>
      </div>
      <span style="font-weight: 700; color: #6366f1;">Págs. 7–8</span>
    </div>
    <div class="toc-item">
      <div class="toc-item-left">
        <span class="toc-icon">💵</span>
        <div>
          <div class="toc-name">Capítulo 5 — Pagos y Ventas Directas</div>
          <div class="toc-desc">Registro de ventas al contado y abonos específicos</div>
        </div>
      </div>
      <span style="font-weight: 700; color: #6366f1;">Pág. 9</span>
    </div>
    <div class="toc-item">
      <div class="toc-item-left">
        <span class="toc-icon">📦</span>
        <div>
          <div class="toc-name">Capítulo 6 — Catálogo de Productos</div>
          <div class="toc-desc">Panel lateral para agregar productos sin interrumpir ventas</div>
        </div>
      </div>
      <span style="font-weight: 700; color: #6366f1;">Pág. 10</span>
    </div>
    <div class="toc-item">
      <div class="toc-item-left">
        <span class="toc-icon">📉</span>
        <div>
          <div class="toc-name">Capítulo 7 — Gastos e Ingresos</div>
          <div class="toc-desc">Control de salidas operativas, fletes y filtros por categoría</div>
        </div>
      </div>
      <span style="font-weight: 700; color: #6366f1;">Págs. 11–12</span>
    </div>
    <div class="toc-item">
      <div class="toc-item-left">
        <span class="toc-icon">📑</span>
        <div>
          <div class="toc-name">Capítulo 8 — Cierres Financieros Quincenales</div>
          <div class="toc-desc">Cortes de caja en bolívares y divisas con análisis de ganancia</div>
        </div>
      </div>
      <span style="font-weight: 700; color: #6366f1;">Pág. 13</span>
    </div>
    <div class="toc-item">
      <div class="toc-item-left">
        <span class="toc-icon">💱</span>
        <div>
          <div class="toc-name">Capítulo 9 — Divisas y Calculadora Rápida</div>
          <div class="toc-desc">Registro de compras de dólares/USDT y tasa implícita</div>
        </div>
      </div>
      <span style="font-weight: 700; color: #6366f1;">Pág. 14</span>
    </div>
    <div class="toc-item">
      <div class="toc-item-left">
        <span class="toc-icon">🌐</span>
        <div>
          <div class="toc-name">Capítulo 10 — Tasa de Cambio Inteligente</div>
          <div class="toc-desc">Los 4 modos de conversión (BCV Oficial, USDT, Zelle, Manual)</div>
        </div>
      </div>
      <span style="font-weight: 700; color: #6366f1;">Pág. 15</span>
    </div>
    <div class="toc-item">
      <div class="toc-item-left">
        <span class="toc-icon">🛡️</span>
        <div>
          <div class="toc-name">Capítulo 11 — Historial de Eventos (Logs)</div>
          <div class="toc-desc">Registro transparente de cada movimiento realizado</div>
        </div>
      </div>
      <span style="font-weight: 700; color: #6366f1;">Pág. 16</span>
    </div>
    <div class="toc-item">
      <div class="toc-item-left">
        <span class="toc-icon">☁️</span>
        <div>
          <div class="toc-name">Capítulo 12 — Sincronización en la Nube y Modo Offline</div>
          <div class="toc-desc">Trabajar sin internet y respaldar datos en Google Sheets</div>
        </div>
      </div>
      <span style="font-weight: 700; color: #6366f1;">Pág. 17</span>
    </div>
  </div>

  <!-- ==================== CAPÍTULO 1 ==================== -->
  <div class="page-break"></div>
  <div class="guide-header">
    <span>HogarFlex — Guía de la Cliente</span>
    <span>Capítulo 1: Acceso a la Aplicación</span>
  </div>

  <div class="chapter-hero">
    <div class="chapter-tag">Capítulo 1</div>
    <h2 class="chapter-title">🔐 Acceso Seguro a la Aplicación</h2>
    <p class="chapter-intro">
      HogarFlex cuenta con una pantalla de bienvenida protegida para garantizar que solo tú puedas ingresar a la información financiera y de clientes.
    </p>
  </div>

  <div class="steps-container">
    <div class="step-card">
      <div class="step-header"><span class="step-badge">1</span> Ingresar tus credenciales</div>
      <div class="step-body">Escribe tu usuario y contraseña en los campos correspondientes. El sistema protege tus datos para que nadie más acceda desde tu teléfono o computadora.</div>
    </div>
    <div class="step-card">
      <div class="step-header"><span class="step-badge">2</span> Botón Ingresar</div>
      <div class="step-body">Al hacer clic en <strong>Iniciar Sesión</strong>, entrarás de inmediato a tu panel principal. Si te equivocas de clave, verás un mensaje en rojo para que puedas corregirla.</div>
    </div>
  </div>

  <div class="img-box avoid-break">
    <img src="${getImageBase64('real_01_login_correcto.png')}" alt="Pantalla de Login">
    <div class="img-caption">Vista del panel de autenticación seguro de HogarFlex</div>
  </div>

  <div class="tip-box">
    <span>💡</span>
    <span><strong>Consejo:</strong> Una vez que inicias sesión, la app recordará tu acceso durante el día para que no tengas que escribir tu clave a cada momento.</span>
  </div>

  <!-- ==================== CAPÍTULO 2 ==================== -->
  <div class="page-break"></div>
  <div class="guide-header">
    <span>HogarFlex — Guía de la Cliente</span>
    <span>Capítulo 2: Panel Principal</span>
  </div>

  <div class="chapter-hero">
    <div class="chapter-tag">Capítulo 2</div>
    <h2 class="chapter-title">📊 El Panel Principal (Dashboard)</h2>
    <p class="chapter-intro">
      El Dashboard es el centro de control de tu negocio. Nada más abrir la app, te muestra un resumen claro del dinero que tienes en la calle, cobros del mes y clientes activos.
    </p>
  </div>

  <div class="steps-container">
    <div class="step-card">
      <div class="step-header"><span class="step-badge">1</span> Tarjetas de Resumen (KPIs)</div>
      <div class="step-body">Arriba verás 4 tarjetas clave: <strong>Clientes Registrados</strong>, <strong>Cobrado en el Mes</strong>, <strong>Saldo Pendiente</strong> y <strong>Gastos Registrados</strong>. Se actualizan automáticamente con cada venta.</div>
    </div>
    <div class="step-card">
      <div class="step-header"><span class="step-badge">2</span> Barra de Navegación</div>
      <div class="step-body">Usa las pestañas superiores para moverte cómodamente entre Clientes, Créditos, Gastos, Divisas y Cierres con un solo toque.</div>
    </div>
  </div>

  <div class="img-box avoid-break">
    <img src="${getImageBase64('rutina_01_dashboard_kpis.png')}" alt="Dashboard Principal">
    <div class="img-caption">Vista panorámica del Dashboard con indicadores financieros en vivo</div>
  </div>

  <!-- ==================== CAPÍTULO 3 — PARTE 1 ==================== -->
  <div class="page-break"></div>
  <div class="guide-header">
    <span>HogarFlex — Guía de la Cliente</span>
    <span>Capítulo 3: Gestión de Clientes (Registro)</span>
  </div>

  <div class="chapter-hero">
    <div class="chapter-tag">Capítulo 3</div>
    <h2 class="chapter-title">👥 Registro y Alta de Clientes</h2>
    <p class="chapter-intro">
      Tener la información de contacto y cédula de tus compradores al día te permite llevar una cobranza impecable, historial de compras y un trato cercano y profesional.
    </p>
  </div>

  <div class="steps-container">
    <div class="step-card">
      <div class="step-header"><span class="step-badge">1</span> Botón "+ Nuevo Cliente"</div>
      <div class="step-body">Haz clic en el botón superior de la sección de Clientes. Se abrirá el formulario para registrar cédula, nombre, teléfono y dirección.</div>
    </div>
    <div class="step-card">
      <div class="step-header"><span class="step-badge">2</span> Validación Antidupplicados</div>
      <div class="step-body">HogarFlex verifica de inmediato que no repitas números de cédula para mantener tu cartera de clientes organizada y sin confusiones.</div>
    </div>
  </div>

  <div class="img-box avoid-break">
    <img src="${getImageBase64('real_03_crear_cliente.png')}" alt="Crear Cliente">
    <div class="img-caption">Formulario amigable de registro de nuevo cliente con validación en vivo</div>
  </div>

  <!-- ==================== CAPÍTULO 3 — PARTE 2 ==================== -->
  <div class="page-break"></div>
  <div class="guide-header">
    <span>HogarFlex — Guía de la Cliente</span>
    <span>Capítulo 3: Gestión de Clientes (Directorio y Búsqueda)</span>
  </div>

  <div class="chapter-hero">
    <div class="chapter-tag">Capítulo 3 (Cont.)</div>
    <h2 class="chapter-title">🔍 Directorio y Búsqueda Reactiva</h2>
    <p class="chapter-intro">
      Encuentra a cualquier cliente en milisegundos sin desplazarte por listas interminables. Consulta su historial, teléfono y créditos vigentes con un solo toque.
    </p>
  </div>

  <div class="steps-container">
    <div class="step-card">
      <div class="step-header"><span class="step-badge">3</span> Buscador Instantáneo</div>
      <div class="step-body">Escribe las primeras letras del nombre o cédula en la barra de búsqueda y la lista se filtrará en tiempo real sin recargar la página.</div>
    </div>
    <div class="step-card">
      <div class="step-header"><span class="step-badge">4</span> Perfil, Edición y WhatsApp</div>
      <div class="step-body">Toca "Ver Perfil" para ver todos sus créditos y pagos acumulados, o "Editar" para actualizar número telefónico o dirección de entrega.</div>
    </div>
  </div>

  <div class="img-box avoid-break">
    <img src="${getImageBase64('rutina_03_busqueda_cliente.png')}" alt="Búsqueda de Cliente">
    <div class="img-caption">Directorio interactivo de clientes con búsqueda reactiva en tiempo real</div>
  </div>

  <!-- ==================== CAPÍTULO 4 — PARTE 1 ==================== -->
  <div class="page-break"></div>
  <div class="guide-header">
    <span>HogarFlex — Guía de la Cliente</span>
    <span>Capítulo 4: Sistema de Créditos (Creación)</span>
  </div>

  <div class="chapter-hero">
    <div class="chapter-tag">Capítulo 4</div>
    <h2 class="chapter-title">💳 Creación de Crédito y Plan de Cuotas</h2>
    <p class="chapter-intro">
      El corazón de HogarFlex: financia productos en cuotas quincenales o mensuales, pacta abonos iniciales y deja que el sistema calcule el saldo y las fechas de vencimiento.
    </p>
  </div>

  <div class="steps-container">
    <div class="step-card">
      <div class="step-header"><span class="step-badge">1</span> Selección de Cliente y Productos</div>
      <div class="step-body">Elige al comprador registrado y selecciona los artículos de tu catálogo. El sistema sumará los precios y calculará el total en dólares y bolívares.</div>
    </div>
    <div class="step-card">
      <div class="step-header"><span class="step-badge">2</span> Plan de Cuotas y Cuota Inicial</div>
      <div class="step-body">Define el número de cuotas (ej. 4 cuotas) y el abono inicial recibido en efectivo, divisas o Bolívares al cambio BCV del día.</div>
    </div>
  </div>

  <div class="img-box avoid-break">
    <img src="${getImageBase64('real_04_crear_credito.png')}" alt="Crear Crédito">
    <div class="img-caption">Ventana de otorgamiento de crédito con plan de cuotas y fechas calculadas</div>
  </div>

  <!-- ==================== CAPÍTULO 4 — PARTE 2 ==================== -->
  <div class="page-break"></div>
  <div class="guide-header">
    <span>HogarFlex — Guía de la Cliente</span>
    <span>Capítulo 4: Sistema de Créditos (Cobranza y Estados)</span>
  </div>

  <div class="chapter-hero">
    <div class="chapter-tag">Capítulo 4 (Cont.)</div>
    <h2 class="chapter-title">💰 Control de Cobranza y Pago de Cuotas</h2>
    <p class="chapter-intro">
      Gestiona los cobros de tus créditos con semáforo inteligente de estados y genera recibos de cobro automáticos con desglose de cuotas pendientes.
    </p>
  </div>

  <div class="steps-container">
    <div class="step-card">
      <div class="step-header"><span class="step-badge">3</span> Semáforo de Cobranza</div>
      <div class="step-body">
        🟢 <strong>Solvente:</strong> Cliente al día sin cuotas pendientes.<br>
        🟡 <strong>Pendiente:</strong> Cuota que vence en la fecha de hoy.<br>
        🔴 <strong>Cortado:</strong> Una o más cuotas vencidas sin saldar.
      </div>
    </div>
    <div class="step-card">
      <div class="step-header"><span class="step-badge">4</span> Registrar Cobro de Cuota</div>
      <div class="step-body">Presiona "Pagar Cuota" en el crédito. Puedes cobrar en USD o en Bolívares usando la tasa BCV oficial del día. El saldo restante se descuenta al instante.</div>
    </div>
  </div>

  <div class="img-box avoid-break">
    <img src="${getImageBase64('real_05_registrar_pago_cuota.png')}" alt="Registrar Pago de Cuota">
    <div class="img-caption">Modal de cobranza con desglose de moneda, tasa de cambio y saldo resultante</div>
  </div>

  <!-- ==================== CAPÍTULO 5 ==================== -->
  <div class="page-break"></div>
  <div class="guide-header">
    <span>HogarFlex — Guía de la Cliente</span>
    <span>Capítulo 5: Pagos y Ventas Directas</span>
  </div>

  <div class="chapter-hero">
    <div class="chapter-tag">Capítulo 5</div>
    <h2 class="chapter-title">💵 Pagos Directos y Ventas de Contado</h2>
    <p class="chapter-intro">
      Distingue claramente entre cobrar una cuota de crédito financiado y asentar una venta directa al contado donde el cliente cancela el valor íntegro de inmediato.
    </p>
  </div>

  <div class="steps-container">
    <div class="step-card">
      <div class="step-header"><span class="step-badge">1</span> Venta al Contado</div>
      <div class="step-body">Entra en el módulo de <strong>Ventas</strong>. Selecciona cliente y mercancía, indica la forma de pago (efectivo, Zelle o Bolívares) y queda registrada sin generar deudas.</div>
    </div>
    <div class="step-card">
      <div class="step-header"><span class="step-badge">2</span> Facturación y Comprobante</div>
      <div class="step-body">La venta directa descuenta inventario automáticamente y emite comprobante de pago limpio para compartir por WhatsApp con el cliente.</div>
    </div>
  </div>

  <div class="img-box avoid-break">
    <img src="${getImageBase64('real_06_venta_directa.png')}" alt="Venta Directa">
    <div class="img-caption">Registro de venta directa al contado con cálculo exacto sin financiamiento</div>
  </div>

  <!-- ==================== CAPÍTULO 6 ==================== -->
  <div class="page-break"></div>
  <div class="guide-header">
    <span>HogarFlex — Guía de la Cliente</span>
    <span>Capítulo 6: Catálogo de Productos</span>
  </div>

  <div class="chapter-hero">
    <div class="chapter-tag">Capítulo 6</div>
    <h2 class="chapter-title">📦 Catálogo y Panel Lateral (Drawer)</h2>
    <p class="chapter-intro">
      ¿Estás a mitad de una venta y te diste cuenta de que no habías guardado el producto? ¡No te preocupes! No tienes que cerrar ni perder nada.
    </p>
  </div>

  <div class="steps-container">
    <div class="step-card">
      <div class="step-header"><span class="step-badge">1</span> Panel Deslizable</div>
      <div class="step-body">Haz clic en <strong>+ Nuevo Producto</strong> desde cualquier formulario. Se abrirá una bandeja lateral donde indicas nombre, distribuidor, costo y precio de venta.</div>
    </div>
    <div class="step-card">
      <div class="step-header"><span class="step-badge">2</span> Sin Pérdida de Datos</div>
      <div class="step-body">Al guardar el producto, el panel se cierra y tu venta continúa exactamente donde la dejaste, con el nuevo producto listo para seleccionarse.</div>
    </div>
  </div>

  <div class="img-box avoid-break">
    <img src="${getImageBase64('real_07_catalogo_producto.png')}" alt="Catálogo de Productos">
    <div class="img-caption">Bandeja lateral inteligente para agregar inventario sobre la marcha</div>
  </div>

  <!-- ==================== CAPÍTULO 7 — PARTE 1 ==================== -->
  <div class="page-break"></div>
  <div class="guide-header">
    <span>HogarFlex — Guía de la Cliente</span>
    <span>Capítulo 7: Gastos e Ingresos (Registro)</span>
  </div>

  <div class="chapter-hero">
    <div class="chapter-tag">Capítulo 7</div>
    <h2 class="chapter-title">📉 Control de Gastos e Ingresos</h2>
    <p class="chapter-intro">
      Para que un negocio crezca, debes saber exactamente en qué se gasta el dinero. Registra compras de mercancía, fletes, gastos operativos y entradas adicionales con conversión automática.
    </p>
  </div>

  <div class="steps-container">
    <div class="step-card">
      <div class="step-header"><span class="step-badge">1</span> Registrar Salidas y Entradas</div>
      <div class="step-body">Ingresa la descripción, fecha y monto en dólares o en bolívares. El sistema calcula la equivalencia según la tasa oficial seleccionada para que mantengas tu libro contable equilibrado.</div>
    </div>
    <div class="step-card">
      <div class="step-header"><span class="step-badge">2</span> Categorías Inteligentes</div>
      <div class="step-body">Asigna cada gasto a su renglón: Operativo, Inventario, Transporte/Flete o Gastos Personales. Esto te permite identificar fugas de capital a tiempo.</div>
    </div>
  </div>

  <div class="img-box avoid-break">
    <img src="${getImageBase64('real_08_registrar_gasto.png')}" alt="Registrar Gasto">
    <div class="img-caption">Formulario limpio para asentar salidas y entradas de dinero con selección de moneda</div>
  </div>

  <!-- ==================== CAPÍTULO 7 — PARTE 2 ==================== -->
  <div class="page-break"></div>
  <div class="guide-header">
    <span>HogarFlex — Guía de la Cliente</span>
    <span>Capítulo 7: Gastos e Ingresos (Filtros y Análisis)</span>
  </div>

  <div class="chapter-hero">
    <div class="chapter-tag">Capítulo 7 (Cont.)</div>
    <h2 class="chapter-title">📊 Clasificación y Filtros por Categoría</h2>
    <p class="chapter-intro">
      Visualiza el desglose exacto de tus finanzas. Filtra por categoría y mes para auditar los costos logísticos, gastos de reposición y utilidades netas del período.
    </p>
  </div>

  <div class="steps-container">
    <div class="step-card">
      <div class="step-header"><span class="step-badge">3</span> Filtros Instantáneos</div>
      <div class="step-body">Utiliza los selectores superiores para ver únicamente gastos "Operativos", "Inventario" o ingresos del mes actual con totales automáticos.</div>
    </div>
    <div class="step-card">
      <div class="step-header"><span class="step-badge">4</span> Historial Completo</div>
      <div class="step-body">Cada transacción queda registrada con su fecha, monto en moneda original y contravalor para facilitarte los cierres quincenales de caja.</div>
    </div>
  </div>

  <div class="img-box avoid-break">
    <img src="${getImageBase64('rutina_02_filtros_tabla.png')}" alt="Tabla de Gastos Filtrada">
    <div class="img-caption">Tabla interactiva de gastos filtrada por categoría con cálculo dinámico de subtotales</div>
  </div>

  <!-- ==================== CAPÍTULO 8 ==================== -->
  <div class="page-break"></div>
  <div class="guide-header">
    <span>HogarFlex — Guía de la Cliente</span>
    <span>Capítulo 8: Cierres Quincenales</span>
  </div>

  <div class="chapter-hero">
    <div class="chapter-tag">Capítulo 8</div>
    <h2 class="chapter-title">📑 Cierres Financieros Quincenales</h2>
    <p class="chapter-intro">
      Haz un balance cada 15 días: anota cuánto efectivo tienes en caja física, cuánto en divisas digitales y la app calculará tu capital neto real.
    </p>
  </div>

  <div class="steps-container">
    <div class="step-card">
      <div class="step-header"><span class="step-badge">1</span> Llenar el Corte Quincenal</div>
      <div class="step-body">Ingresa la tasa BCV del día, el efectivo en bolívares, los billetes en dólares y el saldo digital (Zelle/USDT). Agrega los gastos del período.</div>
    </div>
    <div class="step-card">
      <div class="step-header"><span class="step-badge">2</span> Análisis de Rendimiento</div>
      <div class="step-body">El sistema te dirá tu Capital Neto consolidado y el Capital en la Calle (lo que aún te deben tus clientes) de forma automática.</div>
    </div>
  </div>

  <div class="img-box avoid-break">
    <img src="${getImageBase64('real_12_cierre_financiero.png')}" alt="Cierre Financiero">
    <div class="img-caption">Corte quincenal estructurado con desglose de caja y análisis de activos</div>
  </div>

  <!-- ==================== CAPÍTULO 9 ==================== -->
  <div class="page-break"></div>
  <div class="guide-header">
    <span>HogarFlex — Guía de la Cliente</span>
    <span>Capítulo 9: Mesa de Divisas</span>
  </div>

  <div class="chapter-hero">
    <div class="chapter-tag">Capítulo 9</div>
    <h2 class="chapter-title">💱 Compra de Divisas y Calculadora</h2>
    <p class="chapter-intro">
      Si cobraste bolívares y compraste dólares para proteger tu capital, anótalo aquí para saber a qué tasa real compraste cada dólar.
    </p>
  </div>

  <div class="steps-container">
    <div class="step-card">
      <div class="step-header"><span class="step-badge">1</span> Tasa Implícita Automática</div>
      <div class="step-body">Escribe cuántos bolívares pagaste y cuántos dólares recibiste. La app calculará al momento la tasa exacta (Bs/USD) resultante de la operación.</div>
    </div>
    <div class="step-card">
      <div class="step-header"><span class="step-badge">2</span> Solo Calculando (Simulador)</div>
      <div class="step-body">¿Quieres saber a cuánto te saldría un cambio sin guardarlo? Usa la calculadora y si solo estabas probando, presiona <strong>Cancelar</strong> sin alterar tu historial.</div>
    </div>
  </div>

  <div class="img-box avoid-break">
    <img src="${getImageBase64('real_10_compra_divisas.png')}" alt="Módulo Divisas">
    <div class="img-caption">Módulo de divisas con cálculo de tasa implícita e historial</div>
  </div>

  <!-- ==================== CAPÍTULO 10 ==================== -->
  <div class="page-break"></div>
  <div class="guide-header">
    <span>HogarFlex — Guía de la Cliente</span>
    <span>Capítulo 10: Tasa de Cambio</span>
  </div>

  <div class="chapter-hero">
    <div class="chapter-tag">Capítulo 10</div>
    <h2 class="chapter-title">🌐 Selector de Tasa Inteligente</h2>
    <p class="chapter-intro">
      Venezuela maneja diferentes referencias de cambio. HogarFlex incluye un selector de 4 botones presente en cada ventana para que nunca te equivoques.
    </p>
  </div>

  <div class="steps-container">
    <div class="step-card">
      <div class="step-header"><span class="step-badge">🌐</span> Modo BCV Oficial</div>
      <div class="step-body">Consulta y actualiza la tasa oficial del Banco Central de Venezuela con un solo clic. Si no hay internet, usará la última tasa guardada.</div>
    </div>
    <div class="step-card">
      <div class="step-header"><span class="step-badge">💵</span> Modos USDT, Zelle y Manual</div>
      <div class="step-body">Cambia al instante a la cotización paralela, cuenta de Zelle o escribe el valor exacto que acordaste con tu cliente usando el modo Manual (✏️).</div>
    </div>
  </div>

  <div class="img-box avoid-break">
    <img src="${getImageBase64('estres_06_selectores_tasa.png')}" alt="Selector de Tasas">
    <div class="img-caption">Los 4 modos de tasa disponibles en cada formulario transaccional</div>
  </div>

  <!-- ==================== CAPÍTULO 11 ==================== -->
  <div class="page-break"></div>
  <div class="guide-header">
    <span>HogarFlex — Guía de la Cliente</span>
    <span>Capítulo 11: Auditoría y Logs</span>
  </div>

  <div class="chapter-hero">
    <div class="chapter-tag">Capítulo 11</div>
    <h2 class="chapter-title">🛡️ Historial de Acciones (Logs)</h2>
    <p class="chapter-intro">
      ¿Quieres verificar a qué hora se cobró una cuota o quién creó un cliente? La bitácora del sistema guarda un registro cronológico imborrable de cada evento.
    </p>
  </div>

  <div class="steps-container">
    <div class="step-card">
      <div class="step-header"><span class="step-badge">1</span> Transparencia Total</div>
      <div class="step-body">Cada vez que guardas un cliente, editas un número de teléfono o registras un pago, la app guarda la fecha, hora exacta y los detalles del cambio.</div>
    </div>
    <div class="step-card">
      <div class="step-header"><span class="step-badge">2</span> Tranquilidad para tu Negocio</div>
      <div class="step-body">Si alguna vez dudas de si registraste o no un movimiento, simplemente abre los Logs en el Dashboard y revísalo con total claridad.</div>
    </div>
  </div>

  <div class="img-box avoid-break">
    <img src="${getImageBase64('campo_06_logs_sistema.png')}" alt="Logs del Sistema">
    <div class="img-caption">Ventana de auditoría transparente con registro cronológico de eventos</div>
  </div>

  <!-- ==================== CAPÍTULO 12 ==================== -->
  <div class="page-break"></div>
  <div class="guide-header">
    <span>HogarFlex — Guía de la Cliente</span>
    <span>Capítulo 12: Nube y Modo Offline</span>
  </div>

  <div class="chapter-hero">
    <div class="chapter-tag">Capítulo 12</div>
    <h2 class="chapter-title">☁️ Sincronización y Respaldo Nube</h2>
    <p class="chapter-intro">
      Tu negocio nunca se detiene. Puedes trabajar sin señal ni internet en la calle, y cuando vuelvas a tener conexión, respaldar todo en tu hoja de Google Sheets.
    </p>
  </div>

  <div class="steps-container">
    <div class="step-card">
      <div class="step-header"><span class="step-badge">1</span> 100% Funcional Sin Internet</div>
      <div class="step-body">Si se va la luz o los datos, HogarFlex abre normalmente desde la memoria de tu teléfono. Puedes crear clientes, registrar cobros y ver tus créditos sin conexión.</div>
    </div>
    <div class="step-card">
      <div class="step-header"><span class="step-badge">2</span> Respaldo a Google Sheets</div>
      <div class="step-body">Toca el botón de la nube en la parte superior derecha. Una notificación verde te confirmará que todos tus datos están seguros y respaldados en línea.</div>
    </div>
  </div>

  <div class="img-box avoid-break">
    <img src="${getImageBase64('real_15_sync_sheets.png')}" alt="Respaldo Nube">
    <div class="img-caption">Botón de respaldo a la nube con notificación de confirmación</div>
  </div>

  <!-- ==================== CONTRAPORTADA ==================== -->
  <div class="page-break"></div>
  <div class="back-cover">
    <div>
      <div style="font-size: 32pt; margin-top: 40px;">✨</div>
      <h2 style="font-family: 'Outfit', sans-serif; font-size: 26pt; font-weight: 800; color: #0f172a; margin-top: 10px;">
        HogarFlex fue desarrollado especialmente para ti ❤️
      </h2>
      <p style="font-size: 11pt; color: #475569; max-width: 480px; margin: 15px auto 0 auto; line-height: 1.6;">
        Un sistema pensado para cuidar cada detalle de tu trabajo, darte tranquilidad financiera y ayudarte a hacer crecer tu negocio todos los días.
      </p>
    </div>

    <!-- Espacio reservado para contacto de soporte de Yorman -->
    <div class="support-card">
      <div style="font-size: 8.5pt; text-transform: uppercase; letter-spacing: 1.5px; color: #4f46e5; font-weight: 800; margin-bottom: 6px;">
        🛠️ Soporte Técnico Personalizado
      </div>
      <h3 style="font-size: 13pt; font-weight: 700; color: #0f172a; margin-bottom: 12px;">
        Contacto Directo de Soporte
      </h3>
      <p style="font-size: 9pt; color: #475569; margin-bottom: 14px;">
        Si tienes alguna duda técnica, deseas agregar una nueva función o necesitas restaurar una copia de seguridad:
      </p>
      <div style="border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 8px; padding: 12px; font-size: 9pt; color: #334155; line-height: 1.6;">
        <strong>Desarrollador / Administrador:</strong> Yorman<br>
        <strong>Teléfono / WhatsApp:</strong> ____________________________________<br>
        <strong>Horario de Atención:</strong> Lunes a Sábado<br>
        <strong>Versión del Sistema:</strong> HogarFlex PWA v24 (Producción)
      </div>
    </div>

    <div style="border-top: 1px solid #cbd5e1; padding-top: 16px; font-size: 8.5pt; color: #64748b;">
      © 2026 HogarFlex Noeluis — Todos los derechos reservados.<br>
      Hecho con dedicación, excelencia y tecnología de vanguardia.
    </div>
  </div>

</body>
</html>
`;

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  await page.pdf({
    path: OUTPUT_PDF,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div style="width: 100%; font-size: 8pt; font-family: 'Plus Jakarta Sans', sans-serif; color: #64748b; padding: 0 15mm; display: flex; justify-content: space-between; align-items: center;">
        <span>HogarFlex — Tu Sistema de Gestión Inteligente (Guía para Yorgelis)</span>
        <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
      </div>
    `,
    margin: {
      top: '16mm',
      bottom: '16mm',
      left: '14mm',
      right: '14mm'
    }
  });

  await browser.close();

  const stats = fs.statSync(OUTPUT_PDF);
  console.log(`PDF Guía Yorgelis generado exitosamente: ${OUTPUT_PDF}`);
  console.log(`Tamaño: ${(stats.size / 1024 / 1024).toFixed(2)} MB (${stats.size} bytes)`);
}

generateGuiaYorgelis().catch(console.error);
