const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const userGet = async (req = request, res = response) => {
    //const { q, nombre = 'no name', apiKey } = req.query;
    const { limit = 5, from = 0 } = req.query;
    const [users, total] = await Promise.all([
        User.find({ status: true }).skip(Number(from)).limit(Number(limit)),
        User.countDocuments({ status: true })
    ]);

    res.json({
        total,
        users
    })
}

const userPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, email, ...rest } = req.body;

    // TODO validar contra BD
    if (password) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt)
    }
    const user = await User.findByIdAndUpdate(id, rest);
    res.status(500).json({
        ok: true,
        msg: 'put API - controller',
        user
    })
}

const userPost = async (req, res = response) => {

    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await user.save();
    res.json({
        ok: true,
        msg: 'post API- controller',
        user
    })
}

const userDelete = async (req, res = response) => {
    const { id } = req.params;
    //const user = await User.findByIdAndDelete(id);
    const user = await User.findByIdAndUpdate(id, { status: false });
    res.json(user)
}

module.exports = {
    userGet,
    userPost,
    userPut,
    userDelete
}