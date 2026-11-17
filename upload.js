
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const tiposPermitidos = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp"
};

const armazenamento = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, "public", "uploads"));
    },

    filename: (req, file, callback) => {
        const extensao = tiposPermitidos[file.mimetype];
        const nome = Date.now() + "-" + crypto.randomBytes(8).toString("hex") + extensao;

        callback(null, nome);
    }
});

const upload = multer({
    storage: armazenamento,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, callback) => {
        if (tiposPermitidos[file.mimetype]) {
            callback(null, true);
        } else {
            callback(new Error("Formato inválido. Envie JPG, PNG ou WEBP."));
        }
    }
});

module.exports = upload;
