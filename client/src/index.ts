import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'
import "dotenv/config"
import { logger } from 'hono/logger'
import { trimTrailingSlash } from "hono/trailing-slash";
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'

import { uniRouter } from './universities/uni.router';
import authsRouter from './auth/auth.router';
import { userRouter } from './users/users.router';
import { gameRouter } from './games/games.router';
import openApi from './openApi/openApi';
import { swaggerUI } from '@hono/swagger-ui';
import { prettyJSON } from 'hono/pretty-json'
import { timing } from 'hono/timing'

const app = new Hono({ strict: true })
app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'", 'https:', 'data:'],
    imgSrc: ["'self'", 'data:'],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
    upgradeInsecureRequests: []
  },
  crossOriginEmbedderPolicy: true,
  crossOriginResourcePolicy: true,
  crossOriginOpenerPolicy: true,
  originAgentCluster: true,
  referrerPolicy: "no-referrer",
  strictTransportSecurity: "max-age=31536000; includeSubDomains; preload",
  xFrameOptions: "DENY",
  xContentTypeOptions: "nosniff",
  permissionsPolicy: {
    camera: ['none'],
    geolocation: ['none'],
    microphone: ['none'],
    payment: ['none'],
    usb: ['none']
  }
}))

app.use(csrf())
app.use('/*', cors(
  {
    origin:'https://88c7-102-213-49-60.ngrok-free.app/', // Allow requests from this origin
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
    allowHeaders : ['Content-Type'], // Allowed HTTP methods,
    credentials: true // Allow cookies and credentials
  }
))
app.use(logger())
app.use(trimTrailingSlash())

app.use(timing());
app.use('/*', prettyJSON())

app.get('/ui', swaggerUI({
  url: '/api/v1/doc'
}))

app.get('/', (c) => {
  return c.redirect('/api/v1');
});
app.get('/api/v1', (c) => {
  return c.json({ message: "welcome" })
})

app.notFound((c) => {
  return c.text('Not Found', 404)
})

app.route('/api/v1', authsRouter)
app.route('/api/v1', userRouter)
app.route('/api/v1', gameRouter)
app.route('/api/v1', openApi)
app.route('/api/v1', uniRouter)


serve({
  fetch: app.fetch,
  port: Number(process.env.PORT),
})

console.log(`Server is running on port http://localhost:${process.env.PORT}`)
