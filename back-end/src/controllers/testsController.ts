import { Request, Response } from "express";
import * as testService from "../services/testService.js";

export async function resetDatabase(req: Request, res: Response) {
  await testService.resetDatabase();
  res.status(200).send();
}
