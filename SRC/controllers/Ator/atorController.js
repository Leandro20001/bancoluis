import express from "express";
import {AppDataSource} from "../../database/config.js";
import ator from "../../model/ator.js";
import {IsNull, Like} from "typeorm";

const route = express.Router();
const atorTable = AppDataSource.getRepository(ator);

route.get("/", async (request, response) => {
    const atores = await atorTable.findBy({"deletedAt": IsNull()});
    return response.status(200).send({response: atores});
});

route.get("/:termo", async (request, response) => {
    const { termo } = request.params;
    const atores = await atorTable.findBy({"nome_ator": Like(`%${termo}%`), "deletedAt": IsNull()});

    if (atores.length < 1) {
        return response.status(200).send({response: "Nenhum dado encontrado."});
    }

    return response.status(200).send({response: atores});
});

route.post("/", async (request, response) => {
    const { nome_ator, nacionalidade, foto_ator, sexo, data_nascimento } = request.body;

    if (!nome_ator || nome_ator.length < 2) {
        return response.status(400).send("O nome deve conter mais de um caractere.");
    }

    if (!nacionalidade || !data_nascimento) {
        return response.status(400).send("Nacionalidade e data de nascimento são obrigatórias.");
    }

    if (sexo !== "masculino" && sexo !== "feminino") {
        return response.status(400).send("Esse sexo é inválido.");
    }

    try {
        const atorData = atorTable.create({ nome_ator, nacionalidade, foto_ator, sexo, data_nascimento });
        await atorTable.save(atorData);

        return response.status(201).send("Ator cadastrado com sucesso!");
    } catch (error) {
        return response.status(500).send("response" + error);
    }
});

route.put("/:id", async (request, response) => {
    const { nome_ator, nacionalidade, foto_ator, sexo, data_nascimento } = request.body;
    const { id } = request.params;

    if (!nome_ator || nome_ator.length < 2) {
        return response.status(400).send("O nome deve conter mais de um caractere.");
    }

    if (!nacionalidade || !data_nascimento) {
        return response.status(400).send("Nacionalidade e data de nascimento são obrigatórias.");
    }

    if (sexo !== "masculino" && sexo !== "feminino") {
        return response.status(400).send("Esse sexo é inválido.");
    }

    await atorTable.update({id}, {nome_ator, nacionalidade, foto_ator, sexo, data_nascimento});
    return response.status(200).send("Atualizado com sucesso!");
});

route.delete("/:id", async (request, response) => {
    const { id } = request.params;
    await atorTable.update({id}, {deletedAt:() => "CURRENT_TIMESTAMP"});
    return response.status(200).send({response: "Ator excluído com sucesso!"});
});

export default route;