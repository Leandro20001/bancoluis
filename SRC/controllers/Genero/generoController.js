import express from "express";
import {AppDataSource} from "../../database/config.js";
import genero from "../../model/genero.js";
import {IsNull, Like} from "typeorm";

const route = express.Router();
const generoTable = AppDataSource.getRepository(genero);

route.get("/", async (request, response) => {
    const generos = await generoTable.findBy({"deletedAt": IsNull()});
    return response.status(200).send({response: generos});
});

route.get("/:termo", async (request, response) => {
    const { termo } = request.params;
    const generos = await generoTable.findBy({"nome_genero": Like(`%${termo}%`), "deletedAt": IsNull()});

    if (generos.length < 1) {
        return response.status(200).send({response: "Nenhum dado encontrado."});
    }

    return response.status(200).send({response: generos});
});

route.post("/", async (request, response) => {
    const { nome_genero } = request.body;

    if (!nome_genero || nome_genero.length < 2) {
        return response.status(400).send("O nome deve conter mais de um caractere.");
    }

    try {
        const generoData = generoTable.create({ nome_genero });
        await generoTable.save(generoData);

        return response.status(201).send("Gênero cadastrado com sucesso!");
    } catch (error) {
        return response.status(500).send("response" + error);
    }
});

route.put("/:id", async (request, response) => {
    const { nome_genero } = request.body;
    const { id } = request.params;

    if (!nome_genero || nome_genero.length < 2) {
        return response.status(400).send("O nome deve conter mais de um caractere.");
    }

    await generoTable.update({id}, {nome_genero});
    return response.status(200).send("Atualizado com sucesso!");
});

route.delete("/:id", async (request, response) => {
    const { id } = request.params;
    await generoTable.update({id}, {deletedAt:() => "CURRENT_TIMESTAMP"});
    return response.status(200).send({response: "Gênero excluído com sucesso!"});
});

export default route;