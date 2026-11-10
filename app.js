
const express = require("express");
const { conectarBanco } = require("./database");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index");
});

async function iniciarServidor() {
    try {
        await conectarBanco();

        app.listen(PORT, () => {
            console.log(`Servidor funcionando em http://localhost:${PORT}`);
        });

    } catch (erro) {
        console.error("Erro ao iniciar o servidor:", erro);
    }
}

iniciarServidor();
