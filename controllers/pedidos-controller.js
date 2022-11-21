
const mysql = require('../mysql').pool;

exports.getPedidos = (req,res,next) =>{
        mysql.getConnection((error, conn) => {
            if(error) { return res.status(500).send({ error:error})}
            conn.query(`SELECT pedidos.id_pedidos,
                        pedidos.quantidade,
                        produtos.id_produtos,
                        produtos.nome,
                        produtos.preco
                    FROM pedidos
                INNER JOIN produtos
                    ON produtos.id_produtos = pedidos.produtos_id_produtos;`,
                (error,resultado, fields) =>{
                    if(error) { return res.status(500).send({error:error})}
                    const response = {
                        pedidos: resultado.map(pedido => {
                            return {
                                id_pedido: pedido.id_pedidos,
                                quantidade: pedido.quantidade,
                                produto: {
                                    id_produto: pedido.id_produtos,
                                    nome: pedido.nome,
                                    preco: pedido.preco
                                },
                                request: {
                                    tipo: 'GET',
                                    descricao: 'Retorna todos os pedidos',
                                    url: 'http://localhost:3000/pedidos/' + pedido.id_pedidos
                                }
                            }
                        })
                    }
                    return res.status(200).send(response)
                }
            )
        })
    }

exports.postPedidos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({error: error,responde: null})}
        conn.query(
            'SELECT * FROM  produtos WHERE id_produtos = ?',
            [req.body.id_produtos],
            (error, result, field) => {
                if(error){ return res.status(500).send({error: error,responde: null})}
                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Produto não encontrado'
                    })
                }
            conn.query(
                'INSERT INTO pedidos (produtos_id_produtos,quantidade) VALUES (?,?)',
                [req.body.id_produtos, req.body.quantidade],
                (error, result, field) => {
                    conn.release(); // liberar conexão
                    if(error){ return res.status(500).send({error: error,responde: null})}
                    const response ={
                        mensagem: 'Pedido Inserido com Sucesso',
                        produtoCriado: {
                            id_pedido: result.id_pedido,
                            id_produto: req.body.id_produtos,
                            quantidade: req.body.quantidade,
                            request: {
                                tipo: 'POST',
                                descricao: 'Insere um pedidos',
                                url: 'http://localhost:3000/pedidos/' + req.body.id_pedido
                            }
                        }
                    }
                    return res.status(201).send(response)
                }
            )
        })
    })
}

exports.getUmPedido = (req,res,next) =>{
    mysql.getConnection(( error, conn) => {
        if(error) { return res.status(500).send({error:error})}
        conn.query(
            'SELECT * FROM pedidos WHERE id_pedido = ?',
            [req.params.id_pedido],
            (error,result,fields) => {
                if(error) { return res.status(500).send({ error:error})}
                
                if (result.lenght == 0){
                    return res.status(404).send({
                        mensagem: 'Nâo foi encontrado pedido este ID'
                    })
                }
                const response = {
                    produto: {
                        id_produto: result[0].id_pedido,
                        nome: result[0].id_produto,
                        quantidade: result[0].quantidade,
                        preco: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os pedidos',
                            url: 'http://localhost:3000/pedidos'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )
    })
}

exports.deletePedido = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `DELETE FROM pedidos WHERE id_pedidos = ?`,
            [
                req.body.id_pedido
            ],
            (error, resultado, field) => {
                conn.release(); // liberar conexão
                if(error){ return res.status(500).send({error: error,responde: null})}
                const response = {
                    mensagem: 'pedido removido com sucesso',
                    request:{
                        tipo: 'POST',
                        descricao: 'remove um produto',
                        url: 'http://localhost:3000/produtos',
                        body:{
                            id_produtos: 'Number',
                            quantidade: 'Number'
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    })
}