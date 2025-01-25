"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_server_1 = require("@hono/node-server");
const hono_1 = require("hono");
require("dotenv/config");
const logger_1 = require("hono/logger");
const csrf_1 = require("hono/csrf");
const trailing_slash_1 = require("hono/trailing-slash");
const timeout_1 = require("hono/timeout");
const http_exception_1 = require("hono/http-exception");
const prometheus_1 = require("@hono/prometheus");
const schema_1 = require("./drizzle/schema"); // Add this line to import the users model
const db_1 = __importDefault(require("./drizzle/db"));
const app = new hono_1.Hono();
const customTimeoutException = () => new http_exception_1.HTTPException(408, {
    message: `Request timeout after waiting for more than 10 seconds`,
});
const { printMetrics, registerMetrics } = (0, prometheus_1.prometheus)();
// inbuilt middlewares
app.use((0, logger_1.logger)()); //logs request and response to the console
app.use((0, csrf_1.csrf)()); //prevents CSRF attacks by checking request headers.
app.use((0, trailing_slash_1.trimTrailingSlash)()); //removes trailing slashes from the request URL
app.use('/', (0, timeout_1.timeout)(10000, customTimeoutException));
//3rd party middlewares
app.use('*', registerMetrics);
//webhook endpoint
// Webhook endpoint
app.post('/webhook', async (c) => {
    const event = await c.req.json();
    if (event.type === 'user.created') {
        const userData = event.data;
        // Insert user into database
        await db_1.default.insert(schema_1.users).values({
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
    return c.text('The server is running📢😏😏😏!');
});
app.get('/timeout', async (c) => {
    await new Promise((resolve) => setTimeout(resolve, 11000));
    return c.text("data after 5 seconds", 200);
});
app.get('/metrics', printMetrics);
// app.route("/", bookRouter)   // /users/ /profile
(0, node_server_1.serve)({
    fetch: app.fetch,
    port: Number(process.env.PORT)
});
console.log(`Server is running on port ${process.env.PORT}`);
