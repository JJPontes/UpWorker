import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import api from "../../api/index";

export default function ProfileUpdate() {
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErro("Você precisa estar logado.");
        return;
      }
      await api.put(
        "/users/update-name",
        { nome },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setSucesso("Nome atualizado com sucesso!");
      localStorage.setItem("userName", nome);
    } catch (err: any) {
      console.error("Erro ao atualizar nome:", err);
      setErro(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Erro ao atualizar nome. Tente novamente mais tarde."
      );
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
          Atualizar Nome
        </Typography>
        <form onSubmit={handleUpdate}>
          <TextField
            label="Novo nome"
            fullWidth
            margin="normal"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          {erro && <Typography color="error">{erro}</Typography>}
          {sucesso && <Typography color="primary">{sucesso}</Typography>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Salvar
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
