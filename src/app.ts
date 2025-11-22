import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import { router } from "./routes";
import { syncDatabase } from "./config/initdb";
import {
  boomErrorHandler,
  logError,
  handleError,
} from "./middlewares/global/errorhandler.middleware";
import jobSchedulerService from './background/scheduler';
import { initializeWorkers, shutdownWorkers } from './background/workers'; 
import bullBoardAdapter from "./background/qdashboard";

const PORT = Number(process.env.PORT) || 3001;
const app = express();


app.use(helmet());
app.use(morgan("tiny"));
app.use('/admin/queues', bullBoardAdapter.getRouter());

// Graceful shutdown


app.use(
  cors({
    origin: `http://${process.env.HOST}`,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, "public")));
app.use("/api", router);
app.get("/health", (req, res) => res.send("OK"));
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Resource not found'
  });
});


app.use(boomErrorHandler);
app.use(logError);
app.use(handleError);

(async function bootstrap() {
  try {
    await syncDatabase();
    await initializeWorkers();
    await jobSchedulerService.start();
    console.log("🔗 DB sincronizada correctamente");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Falló la sincronización de la DB:", error);
    process.exit(1);
  }
})();
