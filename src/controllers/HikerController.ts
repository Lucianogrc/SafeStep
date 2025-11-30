// src/controllers/HikerController.ts
import { HikerService, RegisterHikerInput } from "../Services/HikerService";

export class HikerController {
  static async registerHiker(data: RegisterHikerInput) {
    return HikerService.registerHiker(data);
  }
}
