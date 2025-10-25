const {
  criarFornecedores,
  atualizarFornecedores,
  listarFornecedores,
  buscarFornecedoresPorId,
  excluirFornecedores,
} = require("../services/fornecedorService");

async function criarFonecedorControllers(req, res) {
    try{
        const fornecedores = await criarFornecedores(req.body)
        res.status(201).json(fornecedores)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

async function listarFornecedoresController (req, res) {
    try {
        const fornecedores = await listarFornecedores()
        res.status(200).json(fornecedores)
    }catch (error) {
        res.status(400).json( { error: error.message})
    }
}

async function listarFornecedorPorIdController ( req, res) {
    try{
        const { id } = req.params
        const fornecedores = await buscarFornecedoresPorId(parseInt(id))
        res.status(200).json(fornecedores)
    }catch ( error ) {
        res.status(400).json({ error: error.message })
    }
}

async function atualizarFornecedorControler (req, res) {
    try {
        const { id } = req.params
        const fornecedor = await atualizarFornecedores(parseInt(id), req.body)
        res.status(200).json(fornecedor)
    }catch (error) {
        res.status(400).json({ error: error.message })
    }
}

async function excluirFornecedorController (req, res) {
    try {
        const { id } = req.params
        await excluirFornecedores(parseInt(id))
        res.status(204).send()
    }catch (error){
        res.status(400).json({ error: error.message })
    }
}


module.exports = {
    criarFonecedorControllers,
    listarFornecedorPorIdController,
    listarFornecedoresController,
    atualizarFornecedorControler,
    excluirFornecedorController
}