import { Router } from 'express';
import {deleteAllData} from "./handlers/deleteAllData"

export const testingRouter = Router({});

testingRouter
  .delete('/all-data', deleteAllData)
