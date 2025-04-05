const Produto = require('../models/Produto.model');

exports.criarProduto = async (req, res) => {
  const { nome, preco, descricao, categoria, imagem } = req.body;
  try {
    const novoProduto = new Produto({ nome, preco, descricao, categoria, imagem, dono: req.userId });
    await novoProduto.save();
    res.status(201).json(novoProduto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listarProdutos = async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};