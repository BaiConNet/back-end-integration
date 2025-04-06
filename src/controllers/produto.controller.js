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

exports.atualizarProduto = async (req, res) => {
  try {
    const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletarProduto = async (req, res) => {
  try {
    const produto = await Produto.findByIdAndDelete(req.params.id);
    if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
