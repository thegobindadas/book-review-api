import dotenv from "dotenv";
import connectDB from "./db/index.js";
import config from "./config/index.js";
import { app } from "./app.js";



dotenv.config({
    path: './.env'
})




connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log("⚙️ Server error: ", error);
        throw error
    })

    app.listen(config.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${config.PORT}`);
    })
})
.catch((error) => {
    console.log("MONGO db connection failed !!!-> ", error);
})