import "dotenv/config"
import express from "express"
import cors from "cors"
import { router } from "./routes"
import sequelize from './config/database';
import Validator from './models/validator';
import RewardWithdraw from './models/rewardwithdraw';
import Transaction from './models/transaction';
import insertValidators from './config/initdb';

const PORT = Number(process.env.PORT) || 3001; 

const app = express()
app.use(cors())
app.use(express.json())

Validator.hasOne(RewardWithdraw, { foreignKey: 'validator_id' });
RewardWithdraw.belongsTo(Validator, { foreignKey: 'validator_id' });

Validator.hasMany(Transaction, { foreignKey: 'validator_id' });
Transaction.belongsTo(Validator, { foreignKey: 'validator_id' });

sequelize.sync().then(() => {
    Validator; 
    console.log('Database & tables created!');
    insertValidators();
    console.log("validators inserted!")
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
});

app.use(cors({
    origin:  `http://${process.env.HOST}`, // Permitir solo el origen específico de tu frontend
    methods: 'GET,POST,PUT,DELETE',   // Métodos permitidos
    credentials: true                 // Permitir el envío de cookies y cabeceras de autenticación
}));

app.listen(PORT, '0.0.0.0' ,  () => {
    console.log(`Server listening on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
}); 

app.use(router) 
