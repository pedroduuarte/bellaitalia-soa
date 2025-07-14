const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const register = (req, res) => {
  const { name, email, password } = req.body;

  User.findUserByEmail(email, async (err, user) => {
    if (err) return res.status(500).json({ message: 'Erro no servidor.' });
    if (user) return res.status(400).json({ message: 'Email já cadastrado.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    User.createUser({ name, email, password: hashedPassword }, (err, userId) => {
      if (err) return res.status(500).json({ message: 'Erro ao criar usuário.' });
      res.status(201).json({ message: 'Usuário registrado com sucesso!', userId });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByEmail(email, async (err, user) => {
    if (err) return res.status(500).json({ message: 'Erro no servidor.' });
    if (!user) return res.status(400).json({ message: 'Usuário não encontrado.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Senha inválida.' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token, name: user.name });
  });
};

module.exports = {
  register,
  login,
};