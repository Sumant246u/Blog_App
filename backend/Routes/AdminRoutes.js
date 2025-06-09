import express from 'express'
import { adminLogin, ApproveCommentById, deleteCommentById, getAllBlogAdmin, getAllCooments, getDashboard } from '../controller/AdminController.js';
import auth from '../middleware/Auth.js';

const adminRouter= express.Router();

adminRouter.post('/login',adminLogin);
adminRouter.get('/comments', auth, getAllCooments);
adminRouter.get('/blogs', auth, getAllBlogAdmin);
adminRouter.post('/delete-comment',auth, deleteCommentById);
adminRouter.post('/approve-comment', auth, ApproveCommentById);
adminRouter.get('/dashboard',auth, getDashboard);


export default adminRouter;