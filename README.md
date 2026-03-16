# Chat App - Trabajo Final Integrador

Clon de aplicacion de chat construido con Angular 21, usando Standalone Components, Signals, Reactive Forms y control-flow nativo (`@if`, `@for`). Sin librerias de UI externas.

Incluye autenticacion local con rutas protegidas, historial persistente de chats por localStorage y una UI Dark Premium con glassmorphism (manteniendo toggle claro/oscuro).

## Requisitos

- Node.js 20+
- npm 9+

## Instalacion y ejecucion

```bash
npm install
ng serve
```

La aplicacion corre en `http://localhost:4200`.

## Build de produccion

```bash
ng build
```

El output se genera en `dist/chat-app`.

## Rutas

| Ruta | Descripcion |
|---|---|
| `/auth` | Pantalla inicial de Login/Register (tabs) |
| `/chats` | Lista de contactos / chats |
| `/chats/:id` | Conversacion activa con un contacto |
| `/nuevo` | Formulario para crear un nuevo chat |

## Estructura del proyecto

```
src/app/
 core/
    interfaces/        # Modelos: Chat, Contact, Message, Auth
    services/          # ChatService + AuthService
    guards/            # authGuard y guestGuard
 features/
    auth-page/         # Pantalla inicial Login/Register
    chat-list/         # Panel lateral con buscador
    chat-window/       # Ventana de conversacion
    new-chat/          # Formulario reactivo de nuevo chat
 shared/
     components/
        contact-item/  # Item de contacto reutilizable
        message-bubble/# Burbuja de mensaje con animacion
        typing-indicator/# Indicador de escritura reutilizable
     directives/
        auto-resize.directive.ts # Auto-resize para textarea
     pipes/
         time-format    # Pipe para formatear timestamps
```

## Funcionalidades principales

- Pantalla inicial Login/Register en tabs
- Rutas protegidas para chats mediante guards
- Sidebar de chats con filtro en tiempo real
- Conversacion por contacto con respuesta automatica simulada
- Formulario reactivo para crear nuevos chats
- Persistencia de sesion de usuario en localStorage
- Persistencia de historial de chats en localStorage
- Tema claro/oscuro con tokens CSS y persistencia en localStorage
- Estetica Dark Premium con glassmorphism
- Indicador de escritura antes de la respuesta automatica
- Auto-resize del textarea al escribir
- Check de mensaje enviado en burbujas del usuario
- Animaciones de entrada en paneles de conversacion y nuevo chat

## Como probar

1. Abri el navegador en `http://localhost:4200`
2. Intentar abrir `http://localhost:4200/chats` sin sesion debe redirigir a `/auth`
3. Registrate desde la tab `Crear cuenta` y valida que navegue a `/chats`
4. Si estas logueado, intentar abrir `/auth` debe redirigir a `/chats`
5. Abri un chat, envia un mensaje y confirma respuesta automatica + indicador de escritura
6. Recarga la pagina y verifica que sesion e historial se mantienen
7. Usa el boton `+` para crear nuevo chat y valida que aparece en la lista
8. Usa el buscador para filtrar chats en tiempo real
9. Alterna claro/oscuro y valida persistencia de tema
10. Escribi un mensaje largo y verifica auto-resize en textarea
11. Verifica check de enviado y alineacion fuerte app izquierda / usuario derecha

## Persistencia local

- `chat-app:auth:accounts`: cuentas registradas localmente (MVP)
- `chat-app:auth:session`: sesion de usuario actual
- `chat-app:chats`: historial completo de chats y mensajes

Nota: esta autenticacion es un MVP local sin backend. Para produccion se recomienda migrar a autenticacion server-side y almacenamiento seguro de credenciales.

## Deploy en Vercel

El archivo `vercel.json` incluye el rewrite necesario para que las rutas de la SPA funcionen correctamente.

1. Subir el repositorio a GitHub
2. Importar el proyecto en [vercel.com](https://vercel.com)
3. Configurar: Framework -> Angular, Build Command -> `ng build`, Output -> `dist/chat-app/browser`
4. Hacer deploy

## Tecnologias

- Angular 21 (Standalone Components, Signals, control-flow `@if`/`@for`)
- TypeScript 5.9
- CSS nativo con Flexbox y Grid
- Reactive Forms con validaciones
- Lazy loading de rutas con `loadComponent`
- Angular Signals para estado reactivo y UI derivada
