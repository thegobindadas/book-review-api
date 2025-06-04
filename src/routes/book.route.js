import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    createNewBook,
    getAllBooks,
    getBookDetails,
    addReviewToBook,
    searchBooks,
} from "../controllers/book.controller.js";



const router = Router()

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file





router.route("/").post(createNewBook);

//GET /books?page=2&limit=5&author=Rowling&genre=Fantasy
router.route("/").get(getAllBooks);

//GET /search?query=harry
router.route("/search").get(searchBooks);

router.route("/:id").get(getBookDetails);

router.route("/:id/reviews").post(addReviewToBook);










export default router