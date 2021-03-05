const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('./models/home');
const Home = mongoose.model('Home');

require('./models/orcamento');
const Orcamento = mongoose.model('Orcamento');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type,Authorization");
    app.use(cors());
    next();
});

mongoose.connect('mongodb://localhost:27017/mfcbentes', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Conectado ao banco");
}).catch((err) => {
    console.log("Não foi possível conectar ao banco");
})

app.get('/home', async (req, res) => {
    await Home.findOne({}).then((Home) => {
        return res.json({
            Error: false,
            Home
        });
    }).catch((err) => {
        res.status(400).json({
            error: true,
            message: "Nenhum registro encontrado!"
        });
    });
});

app.post('/home', async (req, res) => {
    const dados = {
        "topTitulo": "Temos a solução que sua empresa precisa!",
        "topSubtitulo": "This is a simple hero unit, a simple Jumbotron-style componet from calling extra attetion to featured content or information.",
        "topTextoBtn": "Orçamento",
        "topLinkBtn": "http://localhost:3000/orcamento",

        "serTitulo": "Serviços",
        "serSubtitulo": "Mauris vitae metus id felis blandit cursus. Donec non rhoncus erat. Nulla scelerisque eleifend libero, eget accumsan odio auctor in.",

        "serUmIcone": "laptop-code",
        "serUmTitulo": "Serviço um",
        "serUmDesc": "Duis dapibus volutpat nisl in consectetur. Quisque in convallis lorem.",

        "serDoisIcone": "mobile-alt",
        "serDoisTitulo": "Serviço dois",
        "serDoisDesc": "Donec lacus nunc, faucibus sit amet rutrum vel, consectetur sit amet erat.",

        "serTresIcone": "network-wired",
        "serTresTitulo": "Serviço três",
        "serTresDesc": "Nulla elementum porta nulla, a venenatis dolor eleifend suscipit."
    }

    const homeExiste = await Home.findOne({});
    if (homeExiste) {
        return res.status(400).json({
            error: true,
            message: "Erro: a página Home já possui resgistros!"
        });
    }

    await Home.create(dados, (err) => {
        if (err) return res.status(400).json({
            error: true,
            message: "Erro: conteúdo não cadastrado!"
        });
    });

    return res.json({
        error: false,
        message: "Conteúdo cadastrado!"
    });
});

app.post('/orcamento', async (req, res) => {
    await Orcamento.create(req.body, (err) => {
        if (err) return res.status(400).json({
            error: true,
            message: "Erro: Solicitação de orçamento não foi enviada!"
        });
    });

    return res.json({
        error: false,
        message: "Solicitação de orçamento foi enviada!"
    });
});

app.listen(8080, function () {
    console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});