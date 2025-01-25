// import { Hono } from 'hono';
// import multer from 'multer';
// import { Readable } from 'stream';
// import cloudinary from '../cloudinary.config';


// const upload = multer({ storage: multer.memoryStorage() });
// const uploadRouter = new Hono();

// const bufferToStream = (buffer: Buffer) => {
//     const readable = new Readable();
//     readable._read = () => {}; 
//     readable.push(buffer);
//     readable.push(null);
//     return readable;
//   };

// uploadRouter.post('/upload', upload.single('file'), async (c) => {
//     const file = (c.req as any).file;
//     if (!file) {
//         return c.json({ error: 'No file uploaded' }, 400);
//     }

//     try {
//         const stream = bufferToStream(file.buffer)
//         const uploadResult = await new Promise<any> ((resolve, reject) => {
//             const upoadStream = cloudinary.uploader.upload_stream(
//             {
//                 folder: 'Kuer_uploads',
//                 resource_type: file.mimetype.startsWith('video/') ? 'video' : 'auto', 
//             },
//             (error, result) => {
//                 if(result) resolve(result);
//                 else reject(error);
//             }
//             );
//             stream.pipe(upoadStream);
//         });
//         return c.json({ message: 'File uploaded successfully', url: uploadResult.secure_url },200);
        
//     } catch (error) {
//         console.error(error);
//         return c.json({ error: 'Upload failed' }, 500);
        
//     }
// });

// export default uploadRouter;