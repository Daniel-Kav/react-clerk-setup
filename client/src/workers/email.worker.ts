// import { Worker } from 'bullmq';
// import { sendPasswordResetEmail, sendStudentVerificationEmail, sendVerificationEmail } from '../utils/email';
// import { connection, EmailJob, QueueNames } from '../utils/bullMq';
// export const emailConfigs = {
//     VERIFICATION: {
//         priority: 1, // Highest priority
//         attempts: 3,
//         backoff: {
//             type: 'exponential',
//             delay: 1000 // 1 second
//         }
//     },
//     RESET_PASSWORD: {
//         priority: 2,
//         attempts: 3,
//         backoff: {
//             type: 'exponential',
//             delay: 2000 // 2 seconds
//         }
//     },
//     STUDENT_VERIFICATION: {
//         priority: 3,
//         delay: 5000, // 5 second delay
//         attempts: 5,
//         backoff: {
//             type: 'exponential',
//             delay: 3000
//         }
//     }
// };
// const emailWorker = new Worker<EmailJob>(
//     QueueNames.EMAIL,
//     async (job) => {
//         // await sendEmail(job.data.to, job.data.subject, job.data.html);
//         const { to, type, token } = job.data;
//         const tokenRegex = /token=([^"&]+)/;
//         const config = emailConfigs[type];

//         if (!config) {
//             throw new Error(`Unknown email type: ${type}`);
//         }

//         job.opts = {
//             removeOnComplete: true, removeOnFail: true,
//             ...config
//         };
//         switch (type) {
//             case 'VERIFICATION': {
//                 const verificationtoken = token
//                 if (!verificationtoken) throw new Error('Verification token not found');
//                 await sendVerificationEmail(to, verificationtoken);
//                 break;
//             }
//             case 'RESET_PASSWORD': {
//                 const resetToken = tokenRegex.exec(token)?.[1];
//                 if (!resetToken) throw new Error('Reset token not found');
//                 await sendPasswordResetEmail(to, resetToken);
//                 break;
//             }
//             case 'STUDENT_VERIFICATION': {
//                 const studentToken = tokenRegex.exec(token)?.[1];
//                 if (!studentToken) throw new Error('Student verification token not found');
//                 await sendStudentVerificationEmail(to, studentToken);
//                 break;
//             }
//             default:
//                 throw new Error(`Unknown email type: ${type}`);
//         }
//     },
//     {
//         connection,
//         limiter: {
//             max: 5,
//             duration: 5000
//         },
//         skipLockRenewal: true,
//         concurrency: 1,
//         lockDuration: 30000,
//         stalledInterval: 30000
//     }
// );

// emailWorker.on('completed', (job) => {
//     console.log(`Email job completed: ${job.id}, Type: ${job.data.type}, To: ${job.data.to}`);
// });

// emailWorker.on('failed', (job, error) => {
//     console.error(`Email job ${job?.id} failed:`, {
//         type: job?.data.type,
//         to: job?.data.to,
//         error: error.message
//     });

// });

// emailWorker.on('error', (error) => {
//     console.error('Email worker error:', error);
// });

// export default emailWorker;