
const express = require("express");
const { conectarBanco, getDB } = require("./database");
const upload = require("./upload");
const { ObjectId } = require("mongodb");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", async (req, res) => {
    try {
        const db = getDB();

        const publicacoes = await db.collection("publicacoes")
            .find()
            .sort({ dataCriacao: -1 })
            .toArray();

        res.render("index", { publicacoes });

    } catch (erro) {
        console.error("Erro ao buscar publicações:", erro);
        res.status(500).send("Erro ao carregar as publicações.");
    }
});

app.get("/comunidade", async (req, res) => {
    try {
        const db = getDB();

        const publicacoes = await db.collection("publicacoes")
            .find()
            .sort({ dataCriacao: -1 })
            .toArray();

        res.render("comunidade", { publicacoes });

    } catch (erro) {
        console.error("Erro ao carregar comunidade:", erro);
        res.status(500).send("Erro ao carregar a comunidade.");
    }
});

app.get("/publicacoes/:id", async (req, res) => {
    try {
        const db = getDB();

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Publicação inválida.");
        }

        const publicacao = await db.collection("publicacoes").findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!publicacao) {
            return res.status(404).send("Publicação não encontrada.");
        }

        const comentarios = await db.collection("comentarios")
            .find({ publicacaoId: publicacao._id })
            .sort({ dataCriacao: -1 })
            .toArray();

        res.render("publicacao", { publicacao, comentarios });

    } catch (erro) {
        console.error("Erro ao abrir publicação:", erro);
        res.status(500).send("Erro ao abrir a publicação.");
    }
});

app.post("/publicacoes/:id/comentarios", async (req, res) => {
    try {
        const db = getDB();
        const { nomeUsuario, texto } = req.body;

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Publicação inválida.");
        }

        if (!nomeUsuario?.trim() || !texto?.trim()) {
            return res.status(400).send("Preencha todos os campos.");
        }

        const publicacao = await db.collection("publicacoes").findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!publicacao) {
            return res.status(404).send("Publicação não encontrada.");
        }

        const comentario = {
            publicacaoId: publicacao._id,
            nomeUsuario: nomeUsuario.trim(),
            texto: texto.trim(),
            dataCriacao: new Date()
        };

        await db.collection("comentarios").insertOne(comentario);

        res.redirect(`/publicacoes/${req.params.id}`);

    } catch (erro) {
        console.error("Erro ao salvar comentário:", erro);
        res.status(500).send("Não foi possível enviar o comentário.");
    }
});
app.post("/publicacoes", upload.single("foto"), async (req, res) => {
    try {
        const { nomeUsuario, legenda } = req.body;

        if (!req.file) {
            return res.status(400).send("Selecione uma foto.");
        }

        if (!nomeUsuario || !legenda) {
            return res.status(400).send("Preencha o nome e a legenda.");
        }

        const db = getDB();

        const publicacao = {
            nomeUsuario,
            legenda,
            imagem: `/uploads/${req.file.filename}`,
            dataCriacao: new Date()
        };

        await db.collection("publicacoes").insertOne(publicacao);

      res.redirect("/comunidade");

    } catch (erro) {
        console.error("Erro ao criar publicação:", erro);
        res.status(500).send("Não foi possível criar a publicação.");
    }
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
