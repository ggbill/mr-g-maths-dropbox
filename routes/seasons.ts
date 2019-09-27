import { Request, Response } from 'express';
import { SeasonController } from '../controllers/season.controller';

const router = require('express').Router();
module.exports = router;

router.get('/', async (request: Request, response: Response) => {
    try {
        const result = await SeasonController.GetSeasons();
        response.json(result);
        response.end();
    }catch (err){
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
});

router.get('/:id', async (request: Request, response: Response) => {
    try {
        const result = await SeasonController.GetSeasonById(request.params.id);
        response.json(result);
        response.end();
    }catch (err){
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
});

router.put('/:id', async (request: Request, response: Response) => {
    console.log("id: " + request.params.id);
    console.log("body: " + JSON.stringify(request.body))
    try {
        const result = await SeasonController.UpdateSeason(request.params.id, request.body.season);
        response.json(result);
        response.end();
    }catch (err){
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
});

router.post('/create', async (request: Request, response: Response) => {
    console.log("body: " + JSON.stringify(request.body))
    try {
        const result = await SeasonController.CreateSeason(request.body.season);
        response.json(result);
        response.end();
    }catch (err){
        response.status(500);
        response.end;
        console.error("Error: ", err)
    }
});

