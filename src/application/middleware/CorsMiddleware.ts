import express from "express";

export class CorsMiddleware {
	constructor(
	) {}

    setCors = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        if (request.method === "OPTIONS") {
            return response.status(200).end();
        }

        next();
	};
}