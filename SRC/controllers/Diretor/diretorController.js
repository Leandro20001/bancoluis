import express from "express";
import {AppDataSource} from "../../database/config.js";
import diretor from "../../model/diretor.js";
import {IsNull, Like} from "typeorm";

const route = express.Router();
const diretorTable = AppDataSource.getRepository(diretor);

route.get("/", async (request, response) => {
    const diretores = await diretorTable.findBy({"deletedAt": IsNull()});
    return response.status(200).send({response: diretores});
});

route.get("/:termo", async (request, response) => {
    const { termo } = request.params;
    const diretores = await diretorTable.findBy({"nome_diretor": Like(`%${termo}%`), "deletedAt": IsNull()});

    if (diretores.length < 1) {
        return response.status(200).send({response: "Nenhum dado encontrado."});
    }

    return response.status(200).send({response: diretores});
});

route.post("/", async (request, response) => {
    const { nome_diretor, nacionalidade, foto_diretor, sexo, data_nascimento } = request.body;

    if (!nome_diretor || nome_diretor.length < 2) {
        return response.status(400).send("O nome deve conter mais de um caractere.");
    }

    if (!nacionalidade || !data_nascimento) {
        return response.status(400).send("Nacionalidade e data de nascimento são obrigatórias.");
    }

    if (sexo !== "masculino" && sexo !== "feminino") {
        return response.status(400).send("Esse sexo é inválido.");
    }

    try {
        const diretorData = diretorTable.create({ nome_diretor, nacionalidade, foto_diretor, sexo, data_nascimento });
        await diretorTable.save(diretorData);

        return response.status(201).send("Diretor cadastrado com sucesso!");
    } catch (error) {
        return response.status(500).send("response" + error);
    }
});

route.put("/:id", async (request, response) => {
    const { nome_diretor, nacionalidade, foto_diretor, sexo, data_nascimento } = request.body;
    const { id } = request.params;

    if (!nome_diretor || nome_diretor.length < 2) {
        return response.status(400).send("O nome deve conter mais de um caractere.");
    }

    if (!nacionalidade || !data_nascimento) {
        return response.status(400).send("Nacionalidade e data de nascimento são obrigatórias.");
    }

    if (sexo !== "masculino" && sexo !== "feminino") {
        return response.status(400).send("Esse sexo é inválido.");
    }

    await diretorTable.update({id}, {nome_diretor, nacionalidade, foto_diretor, sexo, data_nascimento});
    return response.status(200).send("Atualizado com sucesso!");
});

route.delete("/:id", async (request, response) => {
    const { id } = request.params;
    await diretorTable.update({id}, {deletedAt:() => "CURRENT_TIMESTAMP"});
    return response.status(200).send({response: "Diretor excluído com sucesso!"});
});

export default route;