const jwt = require('jsonwebtoken')

exports.obrigatorio = (req, res, next) => {
    try {
        const token = req.headers.autorization.split('')[1]
        const decode = jwt.verify(req.body.token,process.env.JWT_KEY)
        req.usuario = decode;
        next();   
    } catch (error) {
        return res.status(401).send({mensagem: 'Falha na autenticação'})
    }

}

exports.opcional = (req, res, next) => {
    try {
        const token = req.headers.autorization.split('')[1]
        const decode = jwt.verify(req.body.token,process.env.JWT_KEY)
        req.usuario = decode;
        next();   
    } catch (error) {
        next();
    }

}