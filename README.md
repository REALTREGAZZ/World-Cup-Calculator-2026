# 🌐 Simulador Mundial 2026 - Versión Web

## 📦 Contenido del Paquete

Esta carpeta contiene todo lo necesario para desplegar tu aplicación web del Simulador Mundial 2026:

```
web-deploy/
├── index.html              # Página principal
├── style.css               # Estilos principales
├── main.js                 # Lógica principal
├── data.js                 # Datos de equipos y grupos
├── translations.js         # Traducciones (ES, EN, FR, PT)
├── manifest.json           # Configuración PWA
├── service-worker.js       # Service Worker (offline)
├── flags/                  # Banderas de países
├── .htaccess              # Configuración Apache
├── netlify.toml           # Configuración Netlify
└── vercel.json            # Configuración Vercel
```

## 🚀 Opciones de Despliegue

### Opción 1: Netlify (Recomendado - GRATIS)

1. Crea una cuenta en [Netlify](https://www.netlify.com/)
2. Arrastra y suelta la carpeta `web-deploy` en Netlify
3. ¡Listo! Tu app estará en línea en segundos

**O usando la CLI:**
```bash
cd web-deploy
npm install -g netlify-cli
netlify deploy --prod
```

### Opción 2: Vercel (GRATIS)

1. Instala Vercel CLI:
```bash
npm install -g vercel
```

2. Despliega:
```bash
cd web-deploy
vercel --prod
```

### Opción 3: GitHub Pages (GRATIS)

1. Crea un repositorio en GitHub
2. Sube la carpeta `web-deploy`
3. Ve a Settings → Pages
4. Selecciona la rama main y la carpeta /web-deploy
5. Guarda y espera unos minutos

### Opción 4: Servidor Propio (Apache/Nginx)

**Para Apache:**
- Ya incluye archivo `.htaccess` configurado
- Sube todos los archivos a tu servidor
- Asegúrate de que `mod_rewrite` esté habilitado

**Para Nginx:**
Añade esta configuración a tu `nginx.conf`:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Opción 5: Firebase Hosting (GRATIS)

1. Instala Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Inicializa Firebase:
```bash
cd web-deploy
firebase login
firebase init hosting
```

3. Despliega:
```bash
firebase deploy
```

## 📱 Progressive Web App (PWA)

Tu app ya está configurada como PWA, lo que significa:

✅ **Instalable** - Los usuarios pueden instalarla como app nativa  
✅ **Offline** - Funciona sin conexión gracias al Service Worker  
✅ **Rápida** - Caché optimizado para carga instantánea  
✅ **SEO** - Optimizada para motores de búsqueda

## 🎨 Iconos de la App

**IMPORTANTE:** Necesitas crear dos iconos para que funcione como PWA:

1. `icon-192.png` - 192x192 píxeles
2. `icon-512.png` - 512x512 píxeles

**Opción fácil:** Usa [favicon.io](https://favicon.io/) o [realfavicongenerator.net](https://realfavicongenerator.net/) para generar los iconos automáticamente.

**Diseño sugerido:**
- Fondo degradado azul oscuro (#1a1a2e a #0f3460)
- Emoji ⚽ o 🏆 centrado
- Bordes redondeados
- Sin texto

## 🌍 Características de la Web

- ✅ **Multiidioma:** Español, Inglés, Francés, Portugués
- ✅ **Responsive:** Se adapta a móviles, tablets y escritorio
- ✅ **Offline-first:** Funciona sin internet después de la primera carga
- ✅ **SEO optimizado:** Meta tags completos para compartir en redes sociales
- ✅ **Fast loading:** Caché agresivo para máxima velocidad
- ✅ **Seguro:** Headers de seguridad configurados

## 🔧 Prueba Local

Para probar localmente antes de desplegar:

```bash
# Instala un servidor simple
npm install -g http-server

# Navega a la carpeta
cd web-deploy

# Ejecuta el servidor
http-server -p 8080

# Abre en tu navegador
# http://localhost:8080
```

## 📊 Analytics (Opcional)

Si quieres añadir Google Analytics, agrega esto antes del cierre de `</head>` en `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=TU_ID_AQUI"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'TU_ID_AQUI');
</script>
```

## 🔒 HTTPS

La mayoría de servicios (Netlify, Vercel, GitHub Pages) incluyen HTTPS automático y gratis.

Para servidores propios, usa [Let's Encrypt](https://letsencrypt.org/) gratis.

## 🐛 Solución de Problemas

**El Service Worker no se registra:**
- Asegúrate de que estés usando HTTPS o localhost
- Revisa la consola del navegador para errores

**Las banderas no se cargan:**
- Verifica que la carpeta `flags/` se haya subido correctamente
- Comprueba las rutas en la consola del navegador

**La app no se instala:**
- Verifica que `manifest.json` esté accesible
- Asegúrate de tener los iconos 192x192 y 512x512

## 📞 Soporte

Si tienes problemas, revisa:
- La consola del navegador (F12)
- Los logs del servidor de hosting
- La documentación de tu plataforma de hosting

## 🎉 ¡Listo!

Tu Simulador Mundial 2026 está listo para conquistar el mundo. ⚽🏆

**Próximos pasos sugeridos:**
1. Crear los iconos de la app
2. Elegir plataforma de hosting
3. Desplegar
4. Compartir el enlace
5. ¡Disfrutar!
