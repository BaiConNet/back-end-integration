const Produto = require('../models/produto.model');
const Pedido = require('../models/pedido.model');
const User = require('../models/user.model');
const { enviarEmail } = require('../utils/email.utils');

exports.criarPedido = async (req, res) => {
  try {
    let total = 0;

    const itensDetalhados = await Promise.all(req.body.itens.map(async (item) => {
      const produto = await Produto.findById(item.produto);
      if (!produto) throw new Error(`Produto com ID ${item.produto} não encontrado`);
      total += produto.preco * item.quantidade;
      return { produto: item.produto, quantidade: item.quantidade };
    }));

    const novoPedido = new Pedido({
      cliente: req.user.id,
      loja: req.body.loja,
      itens: itensDetalhados,
      total
    });

    await novoPedido.save();
    await novoPedido.populate('itens.produto');

    const cliente = await User.findById(req.user.id);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2c3e50;">🛒 Pedido Confirmado!</h2>
        <p>Olá <strong>${cliente.nome}</strong>,</p>
        <p>Recebemos seu pedido e já estamos processando com carinho.</p>

        <h3 style="color: #27ae60;">Detalhes do Pedido:</h3>
        <ul style="padding-left: 20px;">
          ${novoPedido.itens.map(item => `
            <li>${item.produto.nome} - ${item.quantidade}x - R$ ${(item.produto.preco * item.quantidade).toFixed(2)}</li>
          `).join('')}
        </ul>

        <p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>

        <p style="margin-top: 20px;">Acompanhe o status do seu pedido pelo nosso site.</p>

        <p style="color: #888; font-size: 12px;">Obrigado por comprar com a gente! 💚</p>
      </div>
    `;

    await enviarEmail({
      to: cliente.email,
      subject: '✅ Confirmação do seu pedido',
      html
    });

    res.status(201).json({ message: 'Pedido criado com sucesso', pedido: novoPedido });
  } catch (err) {
    console.error('Erro ao criar pedido:', err);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
};

exports.atualizarStatus = async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('cliente');

    if (pedido?.cliente?.email) {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #3498db;">📦 Atualização do Pedido</h2>
          <p>Olá <strong>${pedido.clienteId.nome}</strong>,</p>
          <p>O status do seu pedido foi atualizado para:</p>
          <p style="font-size: 18px;"><strong>${pedido.status.toUpperCase()}</strong></p>

          <p style="margin-top: 20px;">Obrigado por comprar com a gente! Se tiver dúvidas, fale com a loja.</p>
          <p style="color: #888; font-size: 12px;">Equipe BairroApp</p>
        </div>
      `;

      await enviarEmail({
        to: pedido.cliente.email,
        subject: '📦 Atualização do seu pedido',
        html
      });
    }

    res.json(pedido);
  } catch (err) {
    console.error('Erro ao atualizar pedido:', err);
    res.status(500).json({ error: 'Erro ao atualizar pedido' });
  }
};
