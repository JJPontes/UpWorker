import React, { useState } from "react";
import { Button, TextField, Box, Typography, Paper } from "@mui/material";
import api from "../../api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    try {
      const resp = await api.post("/auth/login", { email, senha });
      localStorage.setItem("token", resp.data.token);
      // Salva o nome do usuário no localStorage
      const userName = resp.data.nome;
      localStorage.setItem("userName", userName);
      window.location.href = "/calleds";
    } catch (err: any) {
      console.error("Login error:", err);
      setErro("Usuário ou senha inválidos");
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
          Login
        </Typography>
        <form onSubmit={handleLogin}>
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
          {erro && <Typography color="error">{erro}</Typography>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Entrar
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
