const express = require("express");
const router = express.Router();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const dotenv = require("dotenv");
const mongoose = require("mongoose"); 
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const app = express();

const professorRoutes = require("./routes/professorRoutes");
const coordenadorRoutes = require("./routes/coordenadorRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const disciplinaRoutes = require("./routes/disciplinaRoutes");
const avisoRoutes = require("./routes/avisoRoutes");
const turmaRoutes = require("./routes/turmaRoutes");
const conceitoRoutes = require("./routes/conceitoRoutes"); 
const loginRoutes = require("./routes/loginRoutes");



dotenv.config();

const DB = process.env.DATABASE

mongoose.connect(DB)
.then(() => console.log("Conectado ao Banco de Dados"))
.catch(err => console.log("Erro ao Conectar ao Banco de dados", err));



app.use(helmet());

app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use(bodyParser.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/turma", turmaRoutes);
app.use("/api/professor", professorRoutes);
app.use("/api/aluno", alunoRoutes);
app.use("/api/coordenador", coordenadorRoutes);
app.use("/api/disciplina", disciplinaRoutes);
app.use("/api/aviso", avisoRoutes);
app.use("/api/conceito", conceitoRoutes);
app.use("/api/login", loginRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server está rodando na porta ${PORT}`);
});

