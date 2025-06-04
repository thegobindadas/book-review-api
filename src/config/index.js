
const config = {
    PORT: Number(process.env.PORT) || 8000,
    MONGODB_URI: String(process.env.MONGODB_URI),
    CORS_ORIGIN: String(process.env.CORS_ORIGIN),
    ACCESS_TOKEN_SECRET: String(process.env.ACCESS_TOKEN_SECRET),
    ACCESS_TOKEN_EXPIRY: String(process.env.ACCESS_TOKEN_EXPIRY) || "1d",
    REFRESH_TOKEN_SECRET: String(process.env.REFRESH_TOKEN_SECRET),
    REFRESH_TOKEN_EXPIRY: String(process.env.REFRESH_TOKEN_EXPIRY) || "10d",
}



export default config