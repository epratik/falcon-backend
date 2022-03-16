import "reflect-metadata";
import { container } from 'tsyringe';
import { IRouter } from "./IRouter";
import express from "express";
import { PostController } from "../controllers/PostController";

export class PostRouter implements IRouter  {
    
    constructor(private router: express.Router) {
    }

    initializeRoutes(){
        this.router.patch('/posts', (req, res) => container.resolve(PostController).patch(req, res));
        this.router.post('/posts', (req, res) => container.resolve(PostController).post(req, res));
    }

}

