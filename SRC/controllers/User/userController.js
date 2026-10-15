import express from "express";
import {AppDataSource} from "../../database/config.js";
import user from "../../model/user.js";
import {IsNull, Like} from "typeorm";

const route = express.Router();
const userTable = AppDataSource.getRepository(user);

route.get("/", async (request, response) => {
    const users = await userTable.findBy({"typeUser": "comum", "deletedAt": IsNull()});
    return response.status(200).send({response: users});
});

route.get("/:termo", async (request, response) => {
    const { termo } = request.params;
    const users = await userTable.findBy({"typeUser": Like(`%${termo}%`), "deletedAt": IsNull()});

if (users.length < 1) {
        return response.status(200).send({response: "Nenhum dado encontrado."});
    }   

    return response.status(200).send({response: users});
});

route.post("/", async (request, response) => {
    //nome, email, senha, tipo de usuário
    const { name, email, password, typeUser } = request.body;

    if (name.length < 2) {
        return response.status(400).send("O nome deve conter mais de um caractere.");
    }

    if (!email.includes("@")) {
        return response.status(400).send("O email deve conter @.");
    }

    if (password.length < 6) {
        return response.status(400).send("A senha deve conter mais de 6 caracteres.");
    }

    if (typeUser.toLowerCase() !== "admin" && typeUser.toLowerCase() !== "comum") {
        return response.status(400).send("Esse tipo de usuário é inválido.");
    }

    try{
        const userdata = userTable.create({ name, email, password, typeUser });
        await userTable.save(userdata);

        return response.status(201).send("Usuário cadastrado com sucesso!");
    } catch (error) {
        return response.status(500).send("response" + error);
    }
});

route.put("/", async (request, response) => {
    const { name, email, password, typeUser } = request.body;
    const { id } = request.params;

    if (name.length < 2) {
        return response.status(400).send("O nome deve conter mais de um caractere.");
    }

    if (!email.includes("@")) {
        return response.status(400).send("O email deve conter @.");
    }

    if (password.length < 6) {
        return response.status(400).send("A senha deve conter mais de 6 caracteres.");
    }

    if (typeUser.toLowerCase() !== "admin" && typeUser.toLowerCase() !== "comum") {
        return response.status(400).send("Esse tipo de usuário é inválido.");
    }

    await userTable.update({id}, {name, email, password, typeUser});

    return response.status(200).send("Atualizado com sucesso!");
});

route.delete("/:id", async (request, response) => {
    const { id } = request.params;

    // hard delete:
    // await userTable.delete({id});

    // soft delete:
    await userTable.update({id}, {deletedAt:() => "CURRENT_TIMESTAMP"});

    return response.status(200).send({response: "Usuário excluído com sucesso!"});
});


export default route;