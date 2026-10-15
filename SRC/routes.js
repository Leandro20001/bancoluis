import express from "express";
import userController from "./controllers/User/userController.js";
import atorController from "./controllers/Ator/atorController.js";
import diretorController from "./controllers/Diretor/diretorController.js";
import generoController from "./controllers/Genero/generoController.js";
import premiacaoController from "./controllers/Premiacao/premiacaoController.js";

const routes = express();

routes.use("/User", userController);
routes.use("/Ator", atorController);
routes.use("/Diretor", diretorController);
routes.use("/Genero", generoController);
routes.use("/Premiacao", premiacaoController);

export default routes;