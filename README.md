# Chat App - Trabajo Final Integrador

Clon de aplicacion de chat construido con Angular 21, usando Standalone Components, Signals, Reactive Forms y control-flow nativo (`@if`, `@for`). Sin librerias de UI externas.

Incluye mejoras de UX/UI: tema claro/oscuro persistente, indicador de escritura, auto-resize real del textarea, estado de mensaje enviado y animaciones de transicion entre vistas.

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
        typing-indicator/# Indicador de escritura reutilizable
     directives/
        auto-resize.directive.ts # Auto-resize para textarea
     pipes/
         time-format    # Pipe para formatear timestamps
```

## Funcionalidades principales

- Sidebar de chats con filtro en tiempo real
- Conversacion por contacto con respuesta automatica simulada
- Formulario reactivo para crear nuevos chats
- Tema claro/oscuro con tokens CSS y persistencia en localStorage
- Indicador de escritura antes de la respuesta automatica
- Auto-resize del textarea al escribir
- Check de mensaje enviado en burbujas del usuario
- Animaciones de entrada en paneles de conversacion y nuevo chat

## Como probar

1. Abri el navegador en `http://localhost:4200`
2. Selecciona un contacto de la lista para iniciar una conversacion
3. Escribe un mensaje y presiona Enter o el boton de enviar
4. La app responde automaticamente tras 1-2 segundos y muestra indicador de escritura
5. Usa el boton `+` del sidebar para crear un nuevo chat
6. El buscador filtra contactos en tiempo real
7. Usa el boton de tema en el sidebar para alternar claro/oscuro
8. Escribe un mensaje largo y verifica el auto-resize del textarea
9. Verifica el check de enviado en mensajes del usuario

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
