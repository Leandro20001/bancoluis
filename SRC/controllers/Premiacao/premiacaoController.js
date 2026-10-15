import express from "express";
import {AppDataSource} from "../../database/config.js";
import premiacao from "../../model/premiacao.js";
import {IsNull, Like} from "typeorm";

const route = express.Router();
const premiacaoTable = AppDataSource.getRepository(premiacao);

route.get("/", async (request, response) => {
    const premiacoes = await premiacaoTable.findBy({"deletedAt": IsNull()});
    return response.status(200).send({response: premiacoes});
});

route.get("/:termo", async (request, response) => {
    const { termo } = request.params;
    const premiacoes = await premiacaoTable.findBy({"nome_premiacao": Like(`%${termo}%`), "deletedAt": IsNull()});

    if (premiacoes.length < 1) {
        return response.status(200).send({response: "Nenhum dado encontrado."});
    }

    return response.status(200).send({response: premiacoes});
});

route.post("/", async (request, response) => {
    const { nome_premiacao, valor_premiacao } = request.body;

    if (!nome_premiacao || nome_premiacao.length < 2) {
        return response.status(400).send("O nome deve conter mais de um caractere.");
    }

    try {
        const premiacaoData = premiacaoTable.create({ nome_premiacao, valor_premiacao });
        await premiacaoTable.save(premiacaoData);

        return response.status(201).send("Premiação cadastrada com sucesso!");
    } catch (error) {
        return response.status(500).send("response" + error);
    }
});

route.put("/:id", async (request, response) => {
    const { nome_premiacao, valor_premiacao } = request.body;
    const { id } = request.params;

    if (!nome_premiacao || nome_premiacao.length < 2) {
        return response.status(400).send("O nome deve conter mais de um caractere.");
    }

    await premiacaoTable.update({id}, {nome_premiacao, valor_premiacao});
    return response.status(200).send("Atualizado com sucesso!");
});

route.delete("/:id", async (request, response) => {
    const { id } = request.params;
    await premiacaoTable.update({id}, {deletedAt:() => "CURRENT_TIMESTAMP"});
    return response.status(200).send({response: "Premiação excluída com sucesso!"});
});

export default route;