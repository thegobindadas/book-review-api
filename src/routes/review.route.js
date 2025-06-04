import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    updateReview,
    deleteReview,
} from "../controllers/review.controller.js";



const router = Router()

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file





router.route("/:id").put(updateReview);

router.route("/:id").delete(deleteReview);










export default router