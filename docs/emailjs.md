# Conectar el formulario con EmailJS

Mientras no estén las claves, el formulario abre WhatsApp con el mensaje ya escrito. Nunca se pierde una consulta.

## 1. Cuenta y servicio

1. Crea una cuenta en <https://www.emailjs.com>. El plan gratuito permite 200 correos al mes.
2. En **Email Services**, pulsa **Add New Service** y conecta el correo de la clínica (Gmail u Outlook) o un SMTP.
3. Apunta el **Service ID**.

## 2. Plantilla

En **Email Templates**, crea una plantilla nueva:

- **Subject:** `Nueva consulta web: {{reason}} {{treatment}}`
- **To email:** el correo de la clínica.
- **Reply To:** `{{email}}`
- **Content:**

```
Nombre: {{name}}
Teléfono: {{phone}}
Correo: {{email}}
Motivo: {{reason}}
Tratamiento: {{treatment}}
Idioma: {{language}}
Página: {{page}}

Mensaje:
{{message}}
```

Apunta el **Template ID**.

## 3. Seguridad

En **Account → Security**:

- Activa **Use Private Key** solo si la plantilla se envía desde un servidor. Aquí no aplica: deja la clave pública.
- En **Allowed origins**, pon `https://glowhausaesthetics.net`. Mientras se pruebe, añade también `https://darkgray-mandrill-714142.hostingersite.com`.

Copia la **Public Key** desde **Account → General**.

## 4. Claves en el proyecto

Crea `.env` en la raíz del proyecto. No se sube a git.

```
PUBLIC_EMAILJS_SERVICE_ID=service_xxx
PUBLIC_EMAILJS_TEMPLATE_ID=template_xxx
PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxx
```

Después, vuelve a construir y desplegar. Las claves quedan dentro del JavaScript de la web, que es lo normal en EmailJS: por eso hay que limitar los orígenes permitidos.

El formulario también incluye una trampa para bots (un campo oculto) y limita los envíos a uno cada 10 segundos por navegador.
