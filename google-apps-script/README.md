# Instrucciones de Despliegue — Google Apps Script (HogarFlex_DB)

Este script convierte tu hoja de cálculo **HogarFlex_DB** en un backend API seguro y autónomo, eliminando para siempre la necesidad de que los usuarios inicien sesión con Google en la app.

---

### Paso a paso para desplegar en 2 minutos:

1. **Abre tu hoja de cálculo en Google Sheets**:
   - Inicia sesión con la cuenta propietaria: **messiyorman123@gmail.com**.
   - Abre la hoja de cálculo llamada **HogarFlex_DB**.

2. **Abre el editor de Apps Script**:
   - En el menú superior de Google Sheets, haz clic en:
     `Extensiones` ➔ `Apps Script`.

3. **Pega el código**:
   - Borra cualquier código que aparezca por defecto en el archivo `Código.gs`.
   - Copia todo el contenido del archivo [`Code.gs`](./Code.gs) y pégalo en el editor.
   - Haz clic en el icono del disquete 💾 (Guardar proyecto).

4. **Implementar como Aplicación Web**:
   - Arriba a la derecha, haz clic en el botón azul **Implementar** ➔ **Nueva implementación**.
   - En la ventana que aparece, haz clic en el icono de engranaje ⚙️ (junto a "Seleccionar tipo") y elige **Aplicación web**.
   - Configura los siguientes campos:
     - **Descripción**: `HogarFlex Backend v1`
     - **Ejecutar como**: `Yo (messiyorman123@gmail.com)`
     - **Quién tiene acceso**: `Cualquier persona` (Anyone)  *(¡Muy importante! Así la app puede guardar y leer sin login)*
   - Haz clic en **Implementar**.
   - Si Google te solicita autorizar permisos, haz clic en **Revisar permisos**, selecciona tu cuenta `messiyorman123@gmail.com`, luego **Opciones avanzadas (Advanced)** ➔ **Ir a HogarFlex (no seguro)** y presiona **Permitir**.

5. **Copia la URL**:
   - Google te mostrará una **URL de la aplicación web** que termina en `/exec`:
     `https://script.google.com/macros/s/AKfycb.../exec`
   - Copia esa URL.

6. **Pégala en HogarFlex**:
   - Abre la app HogarFlex, ve a la sección **Respaldo**, pega la URL en el campo y pulsa **Guardar URL**.
   - ¡Listo! A partir de ese momento, cualquier cliente, crédito o pago se sincronizará automáticamente desde cualquier dispositivo sin pedir cuentas de Google.
