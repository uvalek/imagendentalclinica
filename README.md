# Imagen Dental Kids — landing page

Sitio de una sola página para el consultorio de odontopediatría del **Dr. Pedro Martínez Lucero**, en Tehuacán, Puebla.

HTML, CSS y JavaScript puros. **No hay que instalar ni compilar nada.** Se edita con cualquier editor de texto y se sube tal cual.

---

## Cómo ver el sitio en tu computadora

Abrir `index.html` con doble clic funciona para casi todo. Si quieres verlo exactamente como en internet (con el mapa y las fuentes), abre la Terminal en esta carpeta y corre:

```bash
python3 -m http.server 8000
```

Luego entra a `http://localhost:8000` en el navegador. Para detenerlo: `Ctrl + C`.

---

## Qué archivo tocar para cada cosa

| Lo que quieres cambiar | Archivo |
|---|---|
| Textos, teléfono, horarios, dirección, reseñas | `index.html` |
| Colores de los efectos al pasar el mouse | `assets/css/styles.css` |
| Menú, acordeón de preguntas, ojos del hero | `assets/js/app.js` |
| Fotos | `assets/img/` |

> **Regla de oro:** cambia solo el texto que está *entre* las etiquetas (`>` y `<`).
> Todo lo que va dentro de `style="..."` es el diseño — no lo toques.
>
> ```html
> <h3 style="...no tocar...">Este texto sí se puede cambiar</h3>
> ```

---

## Cambiar el teléfono o el WhatsApp

El número aparece en **11 lugares** de `index.html`. Cámbialos todos o quedarán inconsistentes.

Usa "Buscar y reemplazar" (`Cmd + F` en Mac) con estos tres textos:

| Buscar | Qué es | Veces |
|---|---|---|
| `522381742899` | el número dentro de los enlaces de WhatsApp | 5 |
| `+522381742899` | el número dentro de los enlaces de llamada | 3 |
| `+52 238 174 2899` | el número **visible** en pantalla | 3 |

Los primeros dos van **sin espacios ni guiones** (así lo exigen WhatsApp y el marcador del teléfono). El tercero es el que lee la gente y puede llevar espacios.

También hay que actualizarlo en el bloque `"telephone"` del JSON-LD (ver más abajo).

### El mensaje que se escribe solo en WhatsApp

Al final de cada enlace de WhatsApp va el mensaje precargado:

```
?text=Hola%2C%20vi%20su%20p%C3%A1gina%20y%20quiero%20agendar%20una%20cita%20para%20mi%20hijo.
```

Dice: *"Hola, vi su página y quiero agendar una cita para mi hijo."*

Va codificado porque los enlaces no admiten espacios ni acentos: `%20` es un espacio, `%2C` una coma, `%C3%A1` una á. Si quieres otro mensaje, escríbelo en [urlencoder.org](https://www.urlencoder.org/) y pega el resultado. Debe cambiarse en los 5 enlaces.

---

## Cambiar los horarios

Están en **dos lugares** y hay que cambiarlos en los dos:

1. **La tabla visible** en la sección "Ubicación y horarios" (busca `Horario de atención`)
2. **El pie de página** (busca `Lun a vie`)
3. **El JSON-LD** — es lo que Google usa para mostrar "Abierto ahora" en las búsquedas:

```json
{"@type": "OpeningHoursSpecification",
 "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
 "opens": "10:00", "closes": "20:00"}
```

Los días van en inglés y las horas en formato de 24 horas. Es la única parte del archivo que va en inglés — así lo pide el estándar de Google.

---

## Poner las reseñas de Google (pendiente)

Es lo único que falta. Busca `[Reseña — pendiente]` en `index.html`: hay **3 tarjetas** y **1 badge de calificación**.

En cada tarjeta reemplaza:
- `[Reseña — pendiente]` → el texto de la reseña
- `[Nombre — pendiente]` → el nombre de quien la escribió
- `[Calificación de Google — pendiente]` → por ejemplo `4.9 ★ en Google · 87 reseñas`

Y en el JSON-LD, **solo cuando tengas el dato real**, agrega antes de `"address"`:

```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.9",
  "reviewCount": "87",
  "bestRating": "5"
},
```

⚠️ **Nunca inventes esta calificación.** Google compara el dato con tu ficha real; si no coinciden puede quitarte las estrellas de los resultados de búsqueda. Si no tienes el número, es mejor borrar el bloque completo.

---

## Cambiar una foto

1. Deja la foto nueva en `assets/img/`
2. Corre este comando cambiando el nombre y el ancho:

```bash
python3 -c "from PIL import Image; im=Image.open('assets/img/NUEVA.jpg'); w=680; im.convert('RGB').resize((w, round(im.height*w/im.width)), Image.LANCZOS).save('assets/img/NUEVA-680.webp','WEBP',quality=82,method=6)"
```

3. En `index.html` actualiza `src`, `srcset`, `width`, `height` y el `alt` de esa imagen.

**Anchos que usa el sitio:** logo 212 y 424 · Dr. Pedro 540 y 941 · foto de la niña 340 y 680.

Si la foto está recortada sin fondo (como la del Dr. Pedro), cambia `convert('RGB')` por `convert('RGBA')` o el fondo saldrá negro.

---

## Subir los cambios

El sitio está en GitHub y se publica solo en Vercel: cada vez que subes un cambio a la rama principal, Vercel lo publica en 1–2 minutos.

```bash
git add .
git commit -m "Describe aquí qué cambiaste"
git push
```

Antes de subir, abre el sitio en tu computadora y revisa que se vea bien.

---

## Antes de conectar el dominio final

El sitio tiene la dirección provisional escrita en 4 archivos. Cuando tengas el dominio real, busca `imagendentalkids.vercel.app` y reemplázalo en:

- `index.html` — en `canonical`, en las etiquetas `og:`/`twitter:` y en el JSON-LD
- `robots.txt`
- `sitemap.xml`

Si no lo cambias, el enlace se sigue viendo bien al compartirlo, pero Google puede indexar la dirección vieja.

---

## Estructura

```
index.html                 La página completa
assets/
  css/styles.css           Tipografía, efectos hover, menú responsive
  js/app.js                Menú móvil, acordeón, ojos que siguen el cursor
  fonts/                   Nunito (2 archivos, se carga solo el que hace falta)
  img/                     Imágenes en WebP + imagen para compartir
favicon.svg / .ico         Ícono de la pestaña
apple-touch-icon.png       Ícono al guardar en iPhone
site.webmanifest           Datos de la app al instalarla
robots.txt / sitemap.xml   Para Google
_source/                   El archivo original del diseño (no se publica)
```

La carpeta `_source/` guarda el export original de 5.3 MB por si algún día hay que volver a él. No afecta al sitio publicado.

---

## Cosas que conviene saber

**La página pesa unos 230 KB.** Si agregas fotos, conviértelas siempre a WebP con el comando de arriba. Una sola foto de celular sin optimizar pesa más que todo el sitio junto.

**Los ojos del hero no son una imagen.** Están hechos con código (`div` y CSS), por eso pesan cero y se ven nítidos en cualquier pantalla. Si tocas esa parte del HTML se rompe la cara.

**El mapa tarda en aparecer a propósito.** Usa `loading="lazy"`: solo carga cuando el visitante llega a esa sección, para que la página abra rápido en celular.

**Tres textos tienen poco contraste** y son herencia del diseño aprobado (no se cambiaron sin autorización):

| Dónde | Contraste | Mínimo recomendado |
|---|---|---|
| Párrafo del hero, blanco sobre turquesa | 2.03 | 4.5 |
| "Formación y certificaciones", blanco sobre turquesa | 2.03 | 3.0 |
| Texto lila de las reseñas sobre morado | 2.31 | 4.5 |

Se leen, pero cuestan trabajo a plena luz del sol o a quien tiene la vista cansada. Se arregla oscureciendo el turquesa o poniendo el texto en `#0F3F49` (que sí pasa, con 5.67). Es una decisión de diseño.
