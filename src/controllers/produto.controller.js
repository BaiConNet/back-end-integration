const Produto = require('../models/produto.model');
const Loja = require('../models/loja.model');

exports.criarProduto = async (req, res) => {
  const { nome, preco, descricao, categoria, imagem } = req.body;
  try {
    // Busca a loja do usuário autenticado
    const loja = await Loja.findOne({ dono: req.userId });

    if (!loja) {
      return res.status(403).json({ mensagem: 'Você não possui uma loja cadastrada.' });
    }

    const novoProduto = new Produto({ nome, preco, descricao, categoria, imagem, dono: req.userId, loja: loja._id, });
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

exports.listarProdutosPorLoja = async (req, res) => {
  try {
    const { lojaId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(lojaId)) {
      return res.status(400).json({ mensagem: 'ID da loja inválido.' });
    }

    const produtos = await Produto.find({ loja: lojaId });

    if (!produtos.length) {
      return res.status(404).json({ mensagem: 'Nenhum produto encontrado para esta loja.' });
    }

    res.status(200).json(produtos);
  } catch (error) {
    console.error('Erro ao listar produtos por loja:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar produtos.' });
  }
};
