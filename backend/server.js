import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js';
import adminRouter from './Routes/AdminRoutes.js';
import blogRouter from './Routes/BlogRoutes.js';


const app= express();

await connectDB();
//Middlware
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>res.send('API is working'))

app.use('/api/admin',adminRouter)
app.use('/api/blog', blogRouter)

const PORT= process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log('Server is running on port' +  PORT);
    
})

export default app