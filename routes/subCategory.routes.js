import { Router } from "express";
import { createSubCategory, deleteSubCategory, getSubCategory, getSubCategoryById, updateSubCategory } from "../controllers/subCatogory.contoller.js";

const router = Router();

router.get('/getSubCategory', getSubCategory)
router.get('/getSubCategoryById/:id', getSubCategoryById)
router.post('/createSubCategory', createSubCategory)
router.delete('/deleteSubCategory/:id', deleteSubCategory)
router.put('/updateSubCategory/:id', updateSubCategory)


        
export default router