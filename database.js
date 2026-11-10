require("dotenv").config();

const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

let db;

async function conectarBanco() {
    try {
        await client.connect();

        db = client.db("colormake");

        console.log("Conectado ao MongoDB!");

        return db;
    } catch (erro) {
        console.error("Erro ao conectar ao MongoDB:", erro);
        throw erro;
    }
}

function getDB() {
    return db;
}

module.exports = { conectarBanco, getDB };