# Escuela de Lenguaje Santa María de Vínculo - Sitio Web Interactivo 2027

Sitio web oficial, responsivo y dinámico para el **Proceso de Admisión 2027** de la **Escuela de Lenguaje Santa María de Vínculo** (Paine, Región Metropolitana).

Diseñado con fidelidad absoluta al diseño visual original y enriquecido con interactividad completa en cada botón, componente y navegación.

---

## 📁 Estructura del Proyecto

```
escuela/
├── index.html         # Estructura semántica, diseño visual y modales institucionales
├── css/
│   └── styles.css     # Estilos complementarios, transiciones suaves, scrollbar y soporte de impresión
├── js/
│   └── app.js         # Lógica modular de interactividad, validaciones, filtros y modales
└── README.md          # Documentación del proyecto
```

---

## 🚀 Cómo Ejecutar la Aplicación

No requiere dependencias ni servidores complejos:

1. Abre el archivo `index.html` directamente en cualquier navegador moderno (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
2. O utiliza una extensión como *Live Server* en tu editor para disfrutar de recarga automática.

---

## ✨ Características y Elementos Interactivos Implementados

### 1. Navegación Inteligente y Responsive
- **Smooth Scroll con Offset Preciso:** Navegación suave que compensa automáticamente la altura del encabezado fijado.
- **ScrollSpy Dinámico:** Resalta automáticamente la sección activa en el menú al hacer scroll.
- **Menú Móvil Desplegable (Slide-Over Drawer):** Adaptación completa para celulares y tablets con desenfoque de fondo y cierre táctil.
- **Botón "Volver Arriba":** Botón flotante accesible que aparece suavemente tras desplazarse.

### 2. Tarjetas de Niveles y Preselección Automática
- **Filtros por Edad:** Pestañas interactivas para filtrar entre *Todos*, *Medio Mayor (3 años)*, *Pre-Kínder (4 años)* y *Kínder (5 años)*.
- **Enlace Directo "Postular a [Nivel]":** Al hacer clic, hace scroll suave hasta el formulario, selecciona automáticamente el nivel correspondiente en el campo desplegable, resalta el campo con un efecto de pulso y muestra una notificación toast informativa.
- **Fichas Pedagógicas Detalladas:** Modales con los objetivos fonoaudiológicos, frecuencia de sesiones y dinámicas de aula para cada nivel.

### 3. Formulario de Admisión Inteligente
- **Formateador y Validador de RUT Chileno:** Inserción automática de puntos y guion (`12.345.678-9`).
- **Calculador de Edad al 31 de Marzo de 2027 (Criterio MINEDUC):** Al seleccionar la fecha de nacimiento del párvulo, calcula automáticamente los años cumplidos e indica / preselecciona el nivel educativo correspondiente.
- **Máscara de Teléfono / WhatsApp:** Prefijo nacional chileno preconfigurado.
- **Simulación de Envío con Estado de Carga:** Generación de un número de Folio oficial único (ej. `#SMV-2027-8492`), guardado seguro en `localStorage` y pantalla de confirmación.
- **Comprobante Oficial Imprimible:** Modal con vista de comprobante oficial con membrete y opción de impresión directa (`window.print()`).
- **Confirmación Directa por WhatsApp:** Enlace con mensaje preconfigurado que incluye el número de folio y nombre del niño.

### 4. Preguntas Frecuentes (FAQ) Dinámicas
- **Acordeón Animado:** Apertura y cierre suave con rotación de iconos.
- **Buscador en Tiempo Real:** Filtra instantáneamente las preguntas según las palabras clave escritas.
- **Filtros por Categoría:** Chips temáticos (*Gratuidad & Matrícula*, *Diagnóstico TEL*, *Servicios & Jornadas*).

### 5. Modales Institucionales Completos
- **Portal Familia:** Pestañas para Comunicados, Calendario Escolar, Menú JUNAEB y Solicitud de Certificados de Alumno Regular.
- **Evaluación TEL:** Explicación técnica de las pruebas aplicadas (TEPROSIF-R, TECAL, STSG) y requisitos.
- **Proyecto Educativo (PEI):** Misión, visión y sellos de afecto y co-docencia.
- **Reglamento Interno:** Normativa de gratuidad y convivencia escolar.
- **Política de Privacidad:** Resguardo bajo la Ley N° 19.628.
- **Ubicación y Cómo Llegar:** Mapa interactivo integrado con accesos directos a Google Maps y Waze.
- **Canales y Recursos:** Cuadernillos descargables de estimulación bucofacial y contacto con el Centro de Padres.

### 6. Canales de Contacto Directo
- **WhatsApp Flotante con Popup de Atención:** Botón de chat rápido siempre disponible en la esquina inferior derecha.
- **Llamadas y Correos Directos:** Enlaces `tel:` y `mailto:` nativos listos para marcar en dispositivos móviles.

---

## 🎨 Paleta de Color Institucional
- **Peach (Acento cálido):** `#e07a5f`
- **Primary (Terracota):** `#9a442d`
- **Secondary (Verde Esperanza):** `#44664a` / `#48a97c`
- **Tertiary (Dorado cálido):** `#835418`
- **Surface (Fondo suave):** `#fff8f6`
"# escuela-santa-maria" 
"# escuela-santa-maria" 
