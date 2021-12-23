import "reflect-metadata";
import { container } from 'tsyringe';
import { IRouter } from "./IRouter";
import express from "express";
import { UserController } from "../controllers/UserController";

export class UserRouter implements IRouter  {
    
    constructor(private router: express.Router) {
    }

    initializeRoutes(){
        this.router.patch('/user', (req, res) => container.resolve(UserController).patch(req, res));
    }

}

