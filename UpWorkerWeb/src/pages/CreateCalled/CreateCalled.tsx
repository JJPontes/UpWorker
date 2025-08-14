import { exportCalledPdf } from "../../components/ExportPdf/ExportCalledPdf";
import BugChatHelper from "../../components/Common/BugChatHelper";
import MuiDatePicker from "../../components/DateRange/MuiDatePicker";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Snackbar,
} from "@mui/material";
import api from "../../api/index";

const tipoChamadoOptions = ["Bug", "Melhoria", "Projeto"];
const tipoMudancaOptions = [
  "Corretiva",
  "Evolutiva",
  "Banco de Dados",
  "Infraestrutura",
];
const ambienteOptions = ["Produção", "Homologação", "Desenvolvimento"];

export default function CreateCalledPage() {
  // Regras de boas práticas para descrição de bug
  const bugRules = [
    "Descreva o passo a passo para reproduzir o bug.",
    "Informe o ambiente e versão do sistema.",
    "Inclua mensagens de erro, se houver.",
    "Se possível, anexe prints ou logs.",
  ];
  // O número do chamado será o id gerado automaticamente (uuid)
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tipoMudanca, setTipoMudanca] = useState("");
  const [ambiente, setAmbiente] = useState("");
  const [executor, setExecutor] = useState("");
  const [aprovador, setAprovador] = useState("");
  // Removido campo antigo de dataExecucao
  // Estado para data única de execução
  const [dataExecucao, setDataExecucao] = useState<any>(null);
  const [script, setScript] = useState("");
  const [anexo, setAnexo] = useState<File | null>(null);
  const [emergencial, setEmergencial] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "application/sql",
        "text/plain",
      ];
      if (!allowedTypes.includes(file.type) && !file.name.endsWith(".sql")) {
        setErro("Tipo de arquivo não permitido. Apenas PDF, JPG, PNG e SQL.");
        setAnexo(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErro("Arquivo deve ter no máximo 10MB.");
        setAnexo(null);
        return;
      }
      setErro("");
      setAnexo(file);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    // Validação obrigatória
    if (!titulo || !categoria || !tipoMudanca || !dataExecucao || !script) {
      setErro(
        "Preencha todos os campos obrigatórios, incluindo título, categoria e data de execução.",
      );
      return;
    }
    const solicitanteNome = localStorage.getItem("userName");
    if (!solicitanteNome) {
      setErro("Você precisa estar logado para criar um chamado.");
      return;
    }
    try {
      // Formatação do script (exemplo: remove espaços extras)
      const scriptFormatado = script.trim();
      // Simulação de envio
      const formData = new FormData();
      // O backend deve gerar o id e uuid
      formData.append("titulo", titulo);
      formData.append("tipoChamado", categoria);
      formData.append("tipoMudanca", tipoMudanca);
      formData.append("ambiente", ambiente);
      formData.append("executor", executor);
      formData.append("aprovador", aprovador);
      formData.append("dataExecucao", dataExecucao?.toISOString() ?? "");
      formData.append("script", scriptFormatado);
      formData.append("emergencial", emergencial ? "true" : "false");
      if (anexo) formData.append("anexo", anexo);
      formData.append("solicitante", solicitanteNome);

      // Log do conteúdo do FormData
      const fdObj: any = {};
      for (let pair of formData.entries()) {
        fdObj[pair[0]] = pair[1];
      }
      console.log("FormData enviado:", fdObj);

      const response = await api.post("/calleds", formData);
      const { id, uuid } = response.data;
      setSucesso(`Solicitação criada com sucesso!`);
      setOpenToast(true);

      setTimeout(() => {
        navigate("/calleds");
      }, 1800);

      // Gerar documento GMUD em PDF usando componente
      exportCalledPdf({
        id,
        uuid,
        titulo,
        tipoChamado: categoria,
        tipoMudanca,
        ambiente,
        executor,
        aprovador,
        dataExecucaoInicio: dataExecucao?.toISOString() ?? "",
        dataExecucaoFim: "", // Se não houver fim, deixa vazio
        descricao: script,
        script,
        emergencial,
        solicitante: solicitanteNome,
        criadoEm: new Date().toISOString(),
        anexo,
      });

      // Limpa campos
      setTitulo("");
      setCategoria("");
      setTipoMudanca("");
      setAmbiente("");
      setExecutor("");
      setAprovador("");
      setDataExecucao(null);
      setScript("");
      setAnexo(null);
      setEmergencial(false);
    } catch (err) {
      console.error("Erro ao criar o chamado:", err);
      setErro("Erro ao criar o chamado. Tente novamente mais tarde.");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Snackbar
        open={openToast}
        autoHideDuration={1600}
        onClose={() => setOpenToast(false)}
        message={sucesso}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
      <Paper sx={{ p: 4, minWidth: 360, maxWidth: 480 }}>
        <Typography variant="h5" mb={2}>
          Novo Chamado (GMUD)
        </Typography>
        <form onSubmit={handleCreate}>
          <TextField
            label="Título do chamado"
            fullWidth
            margin="normal"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            placeholder="Digite o título do chamado"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Categoria</InputLabel>
            <Select
              label="Categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            >
              {tipoChamadoOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo de mudança</InputLabel>
            <Select
              label="Tipo de mudança"
              value={tipoMudanca}
              onChange={(e) => setTipoMudanca(e.target.value)}
              required
            >
              {tipoMudancaOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Ambiente</InputLabel>
            <Select
              label="Ambiente"
              value={ambiente}
              onChange={(e) => setAmbiente(e.target.value)}
              required
            >
              {ambienteOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Executor"
            fullWidth
            margin="normal"
            value={executor}
            onChange={(e) => setExecutor(e.target.value)}
            required
          />
          <TextField
            label="Aprovador"
            fullWidth
            margin="normal"
            value={aprovador}
            onChange={(e) => setAprovador(e.target.value)}
            required
          />
          <MuiDatePicker
            value={dataExecucao}
            onChange={setDataExecucao}
            placeholder={"Data de execução"}
            error={false}
          />
          <TextField
            label="Script da mudança"
            fullWidth
            margin="normal"
            multiline
            minRows={4}
            value={script}
            onChange={(e) => setScript(e.target.value)}
            required
            placeholder="Cole aqui o script da mudança"
          />
          {categoria === "Bug" && (
            <BugChatHelper
              description={script}
              visible={true}
              rules={bugRules}
            />
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={emergencial}
                onChange={(e) => setEmergencial(e.target.checked)}
              />
            }
            label="É emergencial?"
            sx={{ mt: 1 }}
          />
          <Box mt={2} mb={2}>
            <label htmlFor="file-input">
              <Button variant="outlined" component="span" fullWidth>
                Anexar arquivo (PDF, JPG, PNG, SQL até 10MB)
              </Button>
            </label>
            <input
              id="file-input"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.sql,.txt"
            />
            {anexo && (
              <Typography variant="body2" color="textSecondary">
                Arquivo selecionado: {anexo.name}
              </Typography>
            )}
          </Box>
          {erro && (
            <Typography color="error" mb={1}>
              {erro}
            </Typography>
          )}
          {sucesso && (
            <Typography color="primary" mb={1}>
              {sucesso}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Enviar chamado
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
