import * as packageService from '../services/packageService.js';

export async function createPackage(req, res) {
    try{
        const newPackage = await packageService.createPackage(req.body);
        // 201 Created
        res.status(201).json(newPackage);
    } catch (error) {
        // 400 Bad Request
        res.status(400).json({message: error.message});
    }

}