module.exports = function verificarPermissao(...permissoesPermitidas) {
  return (req, res, next) => {
    if (!req.user || !permissoesPermitidas.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado: permissão insuficiente.' });
    }
    next();
  };
};
