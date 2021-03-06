import "reflect-metadata";
import { container } from 'tsyringe';
import { IRouter } from "./IRouter";
import express from "express";
import { ListController } from "../controllers/ListController";

export class ListRouter implements IRouter  {
    
    constructor(private router: express.Router) {
    }

    initializeRoutes(){
        this.router.get('/lists', (req, res) => container.resolve(ListController).get(req, res));
        this.router.post('/lists', (req, res) => container.resolve(ListController).post(req, res));
    }

}

