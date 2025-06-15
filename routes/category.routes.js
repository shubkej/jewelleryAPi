import { Router } from "express";
import { createCategory, deleteCategory, getCategory, getCategoryById, updateCategory } from "../controllers/catogory.contoller.js";

const router = Router();

router.get('/getCategory', getCategory)
router.get('/getCategoryById/:id', getCategoryById)
router.post('/createCategory', createCategory)
router.delete('/deleteCategory/:id', deleteCategory)
router.put('/updateCategory/:id', updateCategory)


        
export default router