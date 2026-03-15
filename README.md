# Chat App  Trabajo Final Integrador

Clon de aplicación de chat construido con **Angular 21**, usando Standalone Components, Signals, Reactive Forms y control-flow nativo (`@if`, `@for`). Sin librerías de UI externas.

## Requisitos

- Node.js 20+
- npm 9+

## Instalación y ejecución

```bash
npm install
ng serve
```

La aplicación corre en `http://localhost:4200`.

## Build de producción

```bash
ng build
```

El output se genera en `dist/chat-app`.

## Rutas

| Ruta          | Descripción                             |
|---------------|-----------------------------------------|
| `/chats`      | Lista de contactos / chats              |
| `/chats/:id`  | Conversación activa con un contacto     |
| `/nuevo`      | Formulario para crear un nuevo chat     |

## Estructura del proyecto

```
src/app/
 core/
    interfaces/        # Modelos: Chat, Contact, Message
    services/          # ChatService con Signals
 features/
    chat-list/         # Panel lateral con buscador
    chat-window/       # Ventana de conversación
    new-chat/          # Formulario reactivo de nuevo chat
 shared/
     components/
        contact-item/  # Ítem de contacto reutilizable
        message-bubble/# Burbuja de mensaje con animación
     pipes/
         time-format    # Pipe para formatear timestamps
```

## Cómo probar

1. Abrí el navegador en `http://localhost:4200`
2. Seleccioná un contacto de la lista para iniciar una conversación
3. Escribí un mensaje y presioná Enter o el botón de enviar
4. La app responde automáticamente tras 1-2 segundos
5. Usá el botón `+` del sidebar para crear un nuevo chat
6. El buscador filtra contactos en tiempo real

## Deploy en Vercel

El archivo `vercel.json` incluye el rewrite necesario para que las rutas de la SPA funcionen correctamente.

1. Subir el repositorio a GitHub
2. Importar el proyecto en [vercel.com](https://vercel.com)
3. Configurar: Framework  Angular, Build Command  `ng build`, Output  `dist/chat-app/browser`
4. Hacer deploy

## Tecnologías

- Angular 21 (Standalone Components, Signals, control-flow `@if`/`@for`)
- TypeScript 5.8
- CSS nativo con Flexbox y Grid
- Reactive Forms con validaciones
- Lazy loading de rutas con `loadComponent`
