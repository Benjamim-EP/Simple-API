const express = require('express')
const router = express.Router();
const mysql = require('../mysql').pool;

const PedidosController = require('../controllers/pedidos-controller')

router.get('/',PedidosController.getPedidos)
router.post('/', PedidosController.postPedidos)
router.get('/:id_pedido',PedidosController.getUmPedido)
router.delete('/',PedidosController.deletePedido)

router.patch('/',(req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando o PATCH dentro da rota de pedidos' 
    })
})


module.exports = router;
