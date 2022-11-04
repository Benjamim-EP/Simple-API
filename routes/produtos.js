const express = require('express')
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, './uploads/');
    },
    filename: function(req,file,cb){
        cb(null, new Date().getTime() + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})


router.get('/',(req,res,next) =>{
    //res.status(200).send({
    //    mensagem: "Usando o GET dentro da rota de produto"
    //})
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error:error})}
        conn.query( 
            'SELECT * FROM produtos;',
            (error,resultado, fields) =>{
                if(error) { return res.status(500).send({error:error})}
                const response = {
                    quantidade: resultado.length,
                    produtos: resultado.map(prod => {
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            imagem_produto: prod.imagem_produto,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os produtos',
                                url: 'http://localhost:3000/produtos/' + prod.id_produto
                            }
                        }
                    })
                }
                return res.status(200).send(response)
            }
        )
    })
})

router.post('/', upload.single('produto_imagem'),(req, res, next) => {
    //console.log(req.file)
    mysql.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO produtos (nome,preco,imagem_produto) VALUES (?,?,?)',
            [req.body.name, req.body.preco,req.file.path],
            (error, resultado, field) => {
                conn.release(); // liberar conexão
                if(error){ return res.status(500).send({error: error,responde: null})}
                const response ={
                    mensagem: 'Produto Inserido com Sucesso',
                    produtoCriado: {
                        id_produto: resultado.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        imagem_produto : req.file.path,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere um produto',
                            url: 'http://localhost:3000/produtos'
                        }
                    }
                }
                
                return res.status(201).send(response)
            }
        )
    })
})

router.get('/:id_produto',(req,res,next) =>{
    mysql.getConnection(( error, conn) => {
        if(error) { return res.status(500).send({error:error})}
        conn.query(
            'SELECT * FROM produtos WHERE id_produtos = ?',
            [req.params.id_produto],
            (error,result,fields) => {
                if(error) { return res.status(500).send({ error:error})}
                
                if (result.lenght == 0){
                    return res.status(404).send({
                        mensagem: 'Nâo foi encontrado cin este ID'
                    })
                }
                const response = {
                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: {
                            tipo: 'GET',
                            descricao: 'Retorna um produto',
                            url: 'http://localhost:3000/produtos'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )
    })
})
router.patch('/',(req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `UPDATE produtos
                SET nome         = ?,
                    preco        = ?
                WHERE id_produtos = ?`,
            [
                req.body.nome,
                req.body.preco,
                req.body.id_produtos
            ],
            (error, resultado, field) => {
                conn.release(); // liberar conexão
                if(error){ return res.status(500).send({error: error,responde: null})}
                const response ={
                    mensagem: 'Produto atualizado com sucesso',
                    produtoCriado: {
                        id_produto: resultado.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Detalhes de um produto',
                            url: 'http://localhost:3000/produtos/' + req.body.id_produto
                        }
                    }
                }
                
                return res.status(202).send(response)
            }
        )
    })
})

router.delete('/',(req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `DELETE FROM produtos WHERE id_produtos = ?`,
            [
                req.body.id_produtos
            ],
            (error, resultado, field) => {
                conn.release(); // liberar conexão
                if(error){ return res.status(500).send({error: error,responde: null})}
                const response = {
                    mensagem: 'Produto removido com sucesso',
                    request:{
                        tipo: 'POST',
                        descricao: 'remove um produto',
                        url: 'http://localhost:3000/produtos',
                        body:{
                            nome: 'String',
                            preco: 'Number'
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    })
})


module.exports = router;
