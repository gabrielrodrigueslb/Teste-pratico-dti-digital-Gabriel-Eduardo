import express from 'express';
import packageRoutes from './routes/packageRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//Rota de teste
app.get('/', (req, res) => {
    res.send('API de gerenciamento de drones está funcionando!');
});

app.use('/pedidos', packageRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});