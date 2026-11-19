
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const { conectarBanco, getDB } = require("./database");
const { ObjectId } = require("mongodb");
const upload = require("./upload");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: "lax",
        secure: false
    }
}));

function exigirLogin(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect("/login");
    }

    next();
}

app.get("/cadastro", (req, res) => {
    res.render("cadastro");
});

app.post("/cadastro", async (req, res) => {
    try {
        const db = getDB();

        const nome = (req.body.nome || "").trim();
        const email = (req.body.email || "").trim().toLowerCase();
        const senha = req.body.senha || "";

        if (!nome || !email || !senha) {
            return res.status(400).send("Preencha todos os campos.");
        }

        if (nome.length > 40 || senha.length < 8) {
            return res.status(400).send("Verifique os dados informados.");
        }

        const usuarioExistente = await db.collection("usuarios")
            .findOne({ email });

        if (usuarioExistente) {
            return res.status(409).send("Este e-mail já está cadastrado.");
        }

        const senhaHash = await bcrypt.hash(senha, 12);

        const novoUsuario = {
            nome,
            email,
            senha: senhaHash,
            dataCriacao: new Date()
        };

        const resultado = await db.collection("usuarios")
            .insertOne(novoUsuario);

        req.session.usuario = {
            id: resultado.insertedId,
            nome,
            email
        };

        res.redirect("/comunidade");

    } catch (erro) {
        console.error("Erro no cadastro:", erro);
        res.status(500).send("Não foi possível realizar o cadastro.");
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    try {
        const db = getDB();

        const email = (req.body.email || "").trim().toLowerCase();
        const senha = req.body.senha || "";

        const usuario = await db.collection("usuarios")
            .findOne({ email });

        if (!usuario) {
            return res.status(401).send("E-mail ou senha incorretos.");
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).send("E-mail ou senha incorretos.");
        }

        req.session.usuario = {
            id: usuario._id,
            nome: usuario.nome,
            email: usuario.email
        };

        res.redirect("/comunidade");

    } catch (erro) {
        console.error("Erro no login:", erro);
        res.status(500).send("Não foi possível realizar o login.");
    }
});

app.post("/logout", exigirLogin, (req, res) => {
    req.session.destroy((erro) => {
        if (erro) {
            return res.status(500).send("Não foi possível sair.");
        }

        res.clearCookie("connect.sid");
        res.redirect("/");
    });
});

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

        res.render("comunidade", {
            publicacoes,
            usuario: req.session.usuario || null
        });

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

        res.render("publicacao", {
            publicacao,
            comentarios,
            usuario: req.session.usuario || null
        });

    } catch (erro) {
        console.error("Erro ao abrir publicação:", erro);
        res.status(500).send("Erro ao abrir a publicação.");
    }
});

app.post("/publicacoes/:id/comentarios", exigirLogin, async (req, res) => {
    try {
        const db = getDB();
        const texto = (req.body.texto || "").trim();

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Publicação inválida.");
        }

        if (!texto) {
            return res.status(400).send("Digite um comentário.");
        }

        const publicacao = await db.collection("publicacoes").findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!publicacao) {
            return res.status(404).send("Publicação não encontrada.");
        }

        const comentario = {
            publicacaoId: publicacao._id,
            usuarioId: req.session.usuario.id,
            nomeUsuario: req.session.usuario.nome,
            texto,
            dataCriacao: new Date()
        };

        await db.collection("comentarios").insertOne(comentario);

        res.redirect(`/publicacoes/${req.params.id}`);

    } catch (erro) {
        console.error("Erro ao salvar comentário:", erro);
        res.status(500).send("Não foi possível enviar o comentário.");
    }
});

app.post("/publicacoes", exigirLogin, upload.single("foto"), async (req, res) => {
    try {
        const legenda = (req.body.legenda || "").trim();

        if (!req.file) {
            return res.status(400).send("Selecione uma foto.");
        }

        if (!legenda) {
            return res.status(400).send("Escreva uma legenda.");
        }

        const db = getDB();

        const publicacao = {
            usuarioId: req.session.usuario.id,
            nomeUsuario: req.session.usuario.nome,
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
