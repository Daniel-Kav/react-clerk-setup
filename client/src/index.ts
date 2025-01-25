import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import "dotenv/config"
import { logger } from 'hono/logger'
import { csrf } from 'hono/csrf'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { timeout } from 'hono/timeout'
import { HTTPException } from 'hono/http-exception'
import { prometheus } from '@hono/prometheus'

import { userRouter } from './users/user.router'
import { users } from './drizzle/schema' // Add this line to import the users model
import db from './drizzle/db'



const app = new Hono()

const customTimeoutException = () =>
  new HTTPException(408, {
    message: `Request timeout after waiting for more than 10 seconds`,
  })

const { printMetrics, registerMetrics } = prometheus()

// inbuilt middlewares
app.use(logger())  //logs request and response to the console
app.use(csrf()) //prevents CSRF attacks by checking request headers.
app.use(trimTrailingSlash()) //removes trailing slashes from the request URL
app.use('/', timeout(10000, customTimeoutException))
//3rd party middlewares
app.use('*', registerMetrics)


//webhook endpoint
// Webhook endpoint
app.post('/webhook', async (c) => {
  const event = await c.req.json();

  if (event.type === 'user.created') {
    const userData = event.data;

    // Insert user into database
    await db.insert(users).values({
      id: userData.id,
      clerkId: userData.id,
      firstName: userData.first_name,
      lastName: userData.last_name,
      email: userData.email_addresses[0].email_address,
      createdAt: new Date(userData.created_at * 1000),
    });

    console.log('User created and saved to database:', userData);
  }

  return c.text('Webhook received', 200);
});


// default route
app.get('/ok', (c) => {
  return c.text('The server is running📢😏😏😏!')
})
app.get('/timeout', async (c) => {
  await new Promise((resolve) => setTimeout(resolve, 11000))
  return c.text("data after 5 seconds", 200)
})
app.get('/metrics', printMetrics)


// app.route("/", bookRouter)   // /users/ /profile



serve({
  fetch: app.fetch,
  port: Number(process.env.PORT)
})
console.log(`Server is running on port ${process.env.PORT}`)