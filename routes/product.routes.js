import { Router } from "express";
import { addProduct, deleteProduct, getProduct, updateProduct, getProductById, getProductByCategory } from "../controllers/product.controller.js";
import upload from '../middlewares/multer.js'

const router = Router();

router.get('/getProduct', getProduct)
router.get('/getProductById/:id', getProductById)
router.get('/getProductByCategory/:id', getProductByCategory)
// router.post('/addProduct', upload.single('image'), addProduct)
router.post('/addProduct', upload.array('images', 5), addProduct);
router.delete('/deleteProduct/:id', deleteProduct)
router.put('/updateProduct/:id', updateProduct)


export default router