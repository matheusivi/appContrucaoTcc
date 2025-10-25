const express = require("express")
const router = express.Router();
const { registrar, login } = require("../services/authService")
const validateUsuario = require('../middlewares/validateUsuario')

router.post('/registrar', validateUsuario, async (req, res) => {
    try {
        const resultado = await registrar(req.body)
        console.log('Resultado do registrar:', resultado);
        res.status(201).json(resultado)
    }catch (error) {
        console.error('Erro no registrar:', error.message);
        res.status(400).json( { error: error.message })
    }
})

router.post('/login', async (req, res) => {
    try{
        const resultado = await login(req.body)
        res.json(resultado)
    }catch (error) {
        res.status(401).json({ error: error.message})
    }
})

module.exports = router