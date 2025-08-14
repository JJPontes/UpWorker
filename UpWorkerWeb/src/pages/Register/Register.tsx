import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";
import api from "../../api/index";

export default function RegisterPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("Analista");
  const [erro, setErro] = useState("");
  // Removido sucesso, agora só usamos o Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    try {
  await api.post("/users", { nome, email, senha, perfil });
      setOpenSnackbar(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      console.error("Erro ao cadastrar usuário:", err);
      setErro("Erro ao cadastrar usuário");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" mb={2}>
          Cadastro
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <TextField
            label="E-mail"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <TextField
            select
            label="Perfil"
            fullWidth
            margin="normal"
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
          >
            <MenuItem value="Analista">Analista</MenuItem>
            <MenuItem value="Executor">Executor</MenuItem>
          </TextField>
          {erro && <Typography color="error">{erro}</Typography>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Cadastrar
          </Button>
        </form>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Usuário criado com sucesso!
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
