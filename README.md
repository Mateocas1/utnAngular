# Chat App - Trabajo Final Integrador

Clon de aplicacion de chat construido con Angular 21, usando Standalone Components, Signals, Reactive Forms y control-flow nativo (`@if`, `@for`). Sin librerias de UI externas.

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
| `/chats` | Lista de contactos / chats |
| `/chats/:id` | Conversacion activa con un contacto |
| `/nuevo` | Formulario para crear un nuevo chat |

## Estructura del proyecto

```
src/app/
 core/
    interfaces/        # Modelos: Chat, Contact, Message
    services/          # ChatService con Signals
 features/
    chat-list/         # Panel lateral con buscador
    chat-window/       # Ventana de conversacion
    new-chat/          # Formulario reactivo de nuevo chat
 shared/
     components/
        contact-item/  # Item de contacto reutilizable
        message-bubble/# Burbuja de mensaje con animacion
     pipes/
         time-format    # Pipe para formatear timestamps
```

## Como probar

1. Abri el navegador en `http://localhost:4200`
2. Selecciona un contacto de la lista para iniciar una conversacion
3. Escribe un mensaje y presiona Enter o el boton de enviar
4. La app responde automaticamente tras 1-2 segundos
5. Usa el boton `+` del sidebar para crear un nuevo chat
6. El buscador filtra contactos en tiempo real

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
