// src/routers/testing-router.ts

import { Request, Response, Router } from "express";
import { bloggersCollection, postsCollection } from '../../../db/mongo.db'; // Import your MongoDB collections

export const testingRouter = Router({});

export const deleteAllData = async (req: Request, res: Response) => { // Make the function async
    try {
        // Delete all documents from the bloggers collection
        await bloggersCollection.deleteMany({});
        // Delete all documents from the posts collection
        await postsCollection.deleteMany({});

        res.sendStatus(204); // Send 204 No Content for successful deletion
    } catch (error) {
        console.error('Error deleting all data:', error);
        res.sendStatus(500); // Send 500 Internal Server Error if something goes wrong
    }
};

// Register the handler with the router
testingRouter.delete('/all-data', deleteAllData); // Assuming you want a DELETE /all-data endpoint