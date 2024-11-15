import express from "express";
import {create ,getlist,getById,update,deletebyId,getProductsByCategory} from "../controllers/itemController.js";


const router = express.Router();


router.post('/', create); 

router.get('/', getlist); 

router.get('/:id', getById); 

router.put('/:id', update); 

router.delete('/:id', deletebyId); 

router.get('/category/:categoryId', getProductsByCategory);

export default router;