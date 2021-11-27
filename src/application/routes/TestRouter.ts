import "reflect-metadata";
import { container } from 'tsyringe';
import { IRouter } from "./IRouter";
import express from "express";
import { TestController } from "../controllers/TestController";

export class TestRouter implements IRouter  {
    
    constructor(private router: express.Router) {
    }

    initializeRoutes(){
        this.router.get('/test', (req, res) => container.resolve(TestController).test(req, res));
    }

}

