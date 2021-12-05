import "reflect-metadata";
import { container } from 'tsyringe';
import { IRouter } from "./IRouter";
import express from "express";
import { PostController } from "../controllers/PostController";

export class TestRouter implements IRouter  {
    
    constructor(private router: express.Router) {
    }

    initializeRoutes(){
        this.router.get('/post', (req, res) => container.resolve(PostController).get(req, res));
        this.router.patch('/post', (req, res) => container.resolve(PostController).patch(req, res));
    }

}

