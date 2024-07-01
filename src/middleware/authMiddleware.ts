import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { CustomRequest, PayloadType } from "../types/user";
import { NextFunction, Response } from "express";
config();
export const authMiddleware = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    if (
      request.headers &&
      request.headers["authorization"] &&
      request.headers["authorization"].split(" ").at(1)
    ) {
      const decodedToken = <PayloadType>(
        jwt.verify(
          request.headers["authorization"].split(" ")[1],
          process.env.JWT_SECRET!
        )
      );
      request.user = {
        _id: decodedToken._id,
        username: decodedToken.username,
        email: decodedToken.email,
      };
      next();
    } else {
      response.status(401).json({
        message: "you are not authorized",
      });
    }
  } catch (error) {
    response.status(401).json({
      message: "you are not authorized!",
    });
  }
};
