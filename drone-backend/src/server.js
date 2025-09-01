import express from 'express';
import cors from 'cors';
import packageRoutes from './routes/packageRoutes.js';
import allocationRoutes from './routes/allocationRoutes.js';
import dronesRoutes from './routes/dronesRoutes.js';
const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use('/pedidos', packageRoutes);
app.use('/alocacoes', allocationRoutes);
app.use('/drones', dronesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;