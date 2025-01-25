// import { Queue } from 'bullmq';
// import IORedis from 'ioredis';
// import Redis from 'ioredis';

// // export const connection = new IORedis({
// //     host: process.env.REDIS_HOST,
// //     port: Number(process.env.REDIS_PORT),
// //     password: process.env.REDIS_PASSWORD,
// //     maxRetriesPerRequest: null,
// //     enableReadyCheck: false,
// //     retryStrategy(times) {
// //         if (times > 3) {
// //             return null;
// //         }
// //         return Math.min(times * 1000, 3000);
// //     },
// //     reconnectOnError: null
// // });
// // import Redis from "ioredis"

// // const client = new Redis("rediss://default:AW9GAAIjcDEwMWYwNmI1M2FkMWE0NWRlOGFhNDZkNjM0OGZmYzJiZnAxMA@welcome-wallaby-28486.upstash.io:6379");
// // await client.set('foo', 'bar');
// // connection.on('error', (error) => {
// //     console.error('Redis connection error:', error);
// // });

// if (!process.env.REDIS_URL) {
//     throw new Error('REDIS_URL environment variable is not defined');
// }

// export const connection = new Redis(process.env.REDIS_URL,
//     {
//         maxRetriesPerRequest: null,
//         enableReadyCheck: false,
//         retryStrategy(times) {
//             if (times > 3) {
//                 return null;
//             }
//             return Math.min(times * 1000, 3000);
//         },
//         reconnectOnError: null
//     });

// connection.on('error', (error) => {
//     console.error('Redis connection error:', error);
//     connection.disconnect();
// });

// connection.on('connect', () => {
//     console.log('Connected to Redis');
// });

// connection.on('ready', () => {
//     console.log('Redis connection is ready');
// });

// connection.on('reconnecting', () => {
//     console.log('Reconnecting to Redis...');
// });


// export enum QueueNames {
//     EMAIL = 'email',
//     SMS = 'sms',
// }

// export const emailQueue = new Queue<EmailJob>(QueueNames.EMAIL, { connection });

// export interface EmailJob{
//     to: string;
//     token: string;
//     type: 'VERIFICATION' | 'RESET_PASSWORD' | 'STUDENT_VERIFICATION';
// }