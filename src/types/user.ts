import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export type UserType = {
  _id: string;
  username: string;
  email: string;
};

export type PayloadType = JwtPayload & UserType;

export interface CustomRequest extends Request {
  user: UserType;
}
