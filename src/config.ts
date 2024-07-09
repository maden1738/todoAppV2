import dotenv from "dotenv";

dotenv.config();

const config = {
     port: process.env.PORT,
     jwt: {
          secret: process.env.JWT_SECRET,
          accessTokenExpirySeconds: 3000,
          refreshTokenExpirySeconds: 50000,
     },
};

export default config;
