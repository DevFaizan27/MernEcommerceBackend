import express from 'express';
import { addReview, createProduct, deleteProduct, deleteReview, editProduct, getAllProduct ,getAllReviews,getEmployeeProducts,getProductById} from '../controllers/productController.js';
import {authenticateUser }from '../middleware/authentication.js';
import {checkUserRole} from '../middleware/authentication.js';



const router=express.Router();


// ----------'user routes'----------------

// get all product
router.get('/get-all-products',getAllProduct);

//get product with id
router.get('/get-product/:id',getProductById);

//add a review
router.post('/add-review',authenticateUser,addReview);


//get all reviews
router.get('/reviews/:productId',getAllReviews);


//delete review
router.delete('/:productId/reviews/:reviewId',authenticateUser,deleteReview);








// --------'employee routes'-----------------

// add or create  a product
router.post('/employee/add-product',authenticateUser,checkUserRole(['employee']),createProduct);

//get the products
router.get('/employee/getEmployeeProducts',authenticateUser,checkUserRole(['employee']),getEmployeeProducts);


//delete a product
router.delete('/employee/delete-product/:productId',authenticateUser,checkUserRole(['employee']),deleteProduct);

router.put('/employee/edit-product/:productId',authenticateUser,checkUserRole(['employee']),editProduct);





 

export default router