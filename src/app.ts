import "dotenv/config"
import express from "express"
import cors from "cors"
import { router } from "./routes"
import { syncDatabase } from "./config/initdb";



const PORT = Number(process.env.PORT) || 3001; 

const app = express()
app.use(cors())
app.use(express.json())


syncDatabase()
  .then(() => {
    console.log("Database sync complete!");
  })
  .catch((error) => {
    console.error("Error during database sync:", error);
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
