import { CalledActions } from "../../components/ExportPdf/CalledActions";
import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Avatar,
  IconButton,
  Modal,
  Skeleton,
  Fab,
  Drawer,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

import MuiRangePicker from "../../components/DateRange/MuiRangePicker";
import dayjs, { Dayjs } from "dayjs";
import jsPDF from "jspdf";

// Helpers
function getStatusColor(status: string) {
  switch (status) {
    case "Criacao":
      return "#1976d2";
    case "Aprovacao":
      return "#ffa726";
    case "Agendamento":
      return "#00bcd4";
    case "Execucao":
      return "#388e3c";
    case "Em Revisao":
      return "#fbc02d";
    case "Reprovado":
      return "#d32f2f";
    default:
      return "#757575";
  }
}

const CalledsListPage: React.FC = () => {
  // States
  const [calleds, setCalleds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const [statusFiltro, setStatusFiltro] = useState("");
  const [solicitanteFiltro, setSolicitanteFiltro] = useState("");
  // Inicializa o filtro de data para os últimos 7 dias
  const [dataFiltro, setDataFiltro] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs().subtract(7, "day"),
    dayjs(),
  ]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCalled, setSelectedCalled] = useState<any>(null);
  const [acaoLoading, setAcaoLoading] = useState<string>("");
  const [perfil] = useState<"Analista" | "Executor">("Analista"); // Simulação
  const isMobile = window.innerWidth < 600;
  const navigate = useNavigate();

  // Função para mapear os chamados
  function mapChamados(data: any[]): any[] {
    return data.map((item) => ({
      id: Number(item.id), // int PK
      uuid: item.uuid, // UUID
      titulo: item.tipo_chamado,
      descricao: item.script,
      status: item.status,
      criadoEm: item.criado_em,
      dataExecucao: item.data_execucao,
      ambiente: item.ambiente,
      executor: item.executor,
      aprovador: item.aprovador,
      emergencial: item.emergencial,
      revisadoEm: item.revisado_em,
      aprovadoEm: item.aprovado_em,
      anexo: item.anexo,
      anexoNome: item.anexo_nome,
      anexoTipo: item.anexo_tipo,
      solicitante: item.solicitante,
    }));
  }

  // Simulação de fetch
  const fetchCalleds = () => {
  setLoading(true);
  import("../../api/index").then(({ default: api }) => {
    // Monta os parâmetros de filtro
    const params: any = {};
    if (statusFiltro) params.status = statusFiltro;
    if (solicitanteFiltro) params.solicitante = solicitanteFiltro;
    if (dataFiltro[0]) params.dataInicio = dataFiltro[0].format("YYYY-MM-DD");
    if (dataFiltro[1]) params.dataFim = dataFiltro[1].format("YYYY-MM-DD");
    
    api
      .get(`/calleds?${new URLSearchParams(params).toString()}`)
      .then((response) => {
        const data = response.data.data || response.data;
        const chamados = Array.isArray(data) ? mapChamados(data) : [];
        setCalleds(chamados);
      })
      .catch((error) => {
        console.error("API error:", error);
        setErro(
          error?.response?.data?.error ||
          error?.message ||
          "Erro ao buscar chamados."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  });
};

  // Removido o fetch automático ao mudar filtros. Agora só busca ao clicar em "Aplicar filtro".

  useEffect(() => {
    if (erro) setOpenToast(true);
  }, [erro]);

  const handleAcao = (id: number, acao: string) => {
    setAcaoLoading(id + acao);
    setTimeout(() => {
      setAcaoLoading("");
      // Simulação de ação
    }, 1000);
  };

  // Função para exportar PDF do chamado
  // Função para exportar PDF do chamado usando todos os campos
  function exportPdf(called: any) {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("GMUD - Detalhes do Chamado", 20, 18);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Título: ${called.titulo || "-"}`, 20, 32);
    doc.text(`Descrição: ${called.descricao || "-"}`, 20, 40);
    doc.text(`Status: ${called.status || "-"}`, 20, 48);
    // Mostra apenas o nome do solicitante
    let nomeSolicitante = "-";
    if (
      called.solicitante &&
      typeof called.solicitante === "object" &&
      called.solicitante.nameUser
    ) {
      nomeSolicitante = called.solicitante.nameUser;
    } else if (typeof called.solicitante === "string") {
      nomeSolicitante = called.solicitante;
    }
    doc.text(`Solicitante: ${nomeSolicitante}`, 20, 56);
    doc.text(
      `Criado em: ${called.criadoEm ? new Date(called.criadoEm).toLocaleString() : "-"}`,
      20,
      64,
    );
    doc.setLineWidth(0.5);
    doc.line(20, 70, 190, 70);
    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.text("Exportado via UpWorker", 20, 78);
    // Usa o título do chamado como nome do arquivo
    // Remove todos os caracteres especiais, deixando apenas letras, números, hífen e underline
    let tituloArquivo = "Chamado";
    if (called.titulo) {
      tituloArquivo = called.titulo
        .normalize("NFD")
        .replace(/[^\w-]+/g, "_") // remove tudo que não for letra, número, hífen ou underline
        .replace(/_+/g, "_") // substitui múltiplos _ por um só
        .replace(/(^_+)|(_+$)/g, ""); // remove _ do início/fim
      if (!tituloArquivo) tituloArquivo = "Chamado";
    }
    doc.save(`${tituloArquivo}.pdf`);
  }

  return (
    <Box p={isMobile ? 1 : 3}>
      {/* Título principal da página */}
      <Typography variant="h5" sx={{ mb: 1, textAlign: "left" }}>
        Chamados
      </Typography>
      {/* Filtro desktop */}
      {!isMobile && (
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="h6">Filtrar Chamados</Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value as string)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Criacao">Criação</MenuItem>
                <MenuItem value="Aprovacao">Aprovação</MenuItem>
                <MenuItem value="Agendamento">Agendamento</MenuItem>
                <MenuItem value="Execucao">Execução</MenuItem>
                <MenuItem value="Em Revisao">Em Revisão</MenuItem>
                <MenuItem value="Reprovado">Reprovado</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <TextField
                label="Solicitante"
                variant="outlined"
                size="small"
                value={solicitanteFiltro}
                onChange={(e) => setSolicitanteFiltro(e.target.value)}
                placeholder="Digite o nome do solicitante"
                fullWidth
              />
            </FormControl>
            <FormControl
              size="small"
              sx={{ minWidth: 220, position: "relative", zIndex: 1200 }}
            >
              <MuiRangePicker
                value={dataFiltro}
                onChange={(dates) => setDataFiltro(dates ?? [null, null])}
                placeholder={["Início", "Fim"]}
              />
            </FormControl>
            <Button variant="contained" color="primary" onClick={fetchCalleds}>
              Aplicar filtro
            </Button>
            <Button
              variant="text"
              color="secondary"
              onClick={() => {
                setStatusFiltro("");
                setSolicitanteFiltro("");
                setDataFiltro([null, null]);
              }}
            >
              Limpar
            </Button>
          </Stack>
          <Box mt={2}>
            {statusFiltro && (
              <Chip label={`Status: ${statusFiltro}`} sx={{ mr: 1 }} />
            )}
            {solicitanteFiltro && (
              <Chip
                label={`Solicitante: ${solicitanteFiltro}`}
                sx={{ mr: 1 }}
              />
            )}
            {dataFiltro[0] && dataFiltro[1] && (
              <Chip
                label={`Data: ${dataFiltro[0].format("DD/MM/YYYY")} - ${dataFiltro[1].format("DD/MM/YYYY")}`}
                sx={{ mr: 1 }}
              />
            )}
          </Box>
        </Paper>
      )}
      <Typography variant="body2" color="textSecondary" mb={1} textAlign="left">
        Total: {calleds.length}
      </Typography>
      {erro && (
        <Snackbar
          open={openToast}
          autoHideDuration={4000}
          onClose={() => setOpenToast(false)}
          message={erro}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          ContentProps={{
            sx: { background: "#d32f2f", color: "#fff", fontWeight: 500 },
          }}
        />
      )}
      {loading ? (
        <Stack spacing={2}>
          {[1, 2, 3].map(() => (
            <Paper
              key={Math.random().toString(36).slice(2)}
              sx={{ p: isMobile ? 1 : 2 }}
            >
              <Skeleton variant="text" width={120} />
              <Skeleton variant="rectangular" height={40} sx={{ mb: 1 }} />
              <Skeleton variant="text" width={80} />
              <Skeleton variant="text" width={160} />
            </Paper>
          ))}
        </Stack>
      ) : (
        <Stack spacing={2}>
          {calleds.length === 0 ? (
            <Typography
              variant="body1"
              color="textSecondary"
              textAlign={isMobile ? "center" : "left"}
            >
              Não há chamados.
            </Typography>
          ) : (
            calleds.map((c) => {
              const nomeSolicitante =
                c.solicitante && c.solicitante.name
                  ? c.solicitante.name.charAt(0).toUpperCase() +
                    c.solicitante.name.slice(1)
                  : "-";
              const descricaoMobile =
                isMobile && c.descricao && c.descricao.length > 30
                  ? c.descricao.slice(0, 30) + "..."
                  : c.descricao;
              return (
                <Paper
                  key={c.id}
                  sx={{
                    p: isMobile ? 1 : 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
                    {nomeSolicitante !== "-" ? nomeSolicitante[0] : "?"}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="h6" color="primary">
                      {c.titulo || (
                        <span style={{ color: "#d32f2f" }}>Sem título</span>
                      )}
                    </Typography>
                    <Chip
                      label={c.status}
                      sx={{
                        mr: 1,
                        backgroundColor: getStatusColor(c.status),
                        color: "#fff",
                      }}
                    />
                    {isMobile ? (
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-start"
                        mt={0.5}
                      >
                        <Typography variant="caption">
                          Solicitante: {nomeSolicitante}
                        </Typography>
                        <Typography variant="caption">
                          Criado em: {new Date(c.criadoEm).toLocaleString()}
                        </Typography>
                      </Box>
                    ) : (
                      <Box display="flex" alignItems="center" mt={0.5}>
                        <Typography variant="caption">
                          Solicitante: {nomeSolicitante}
                        </Typography>
                        <Typography variant="caption" sx={{ ml: 2 }}>
                          Criado em: {new Date(c.criadoEm).toLocaleString()}
                        </Typography>
                      </Box>
                    )}
                    <Typography sx={{ mt: 1 }}>{descricaoMobile}</Typography>
                    <Box mt={1}>
                      {/* Ações por status/perfil */}
                      {perfil === "Analista" &&
                        (c.status === "Criacao" ||
                          c.status === "Aprovacao") && (
                          <Button
                            size="small"
                            color="success"
                            onClick={() => handleAcao(c.id, "aprovar")}
                            sx={{ mr: 1 }}
                            disabled={acaoLoading === c.id + "aprovar"}
                          >
                            {acaoLoading === c.id + "aprovar" ? (
                              <CircularProgress size={18} />
                            ) : (
                              "Aprovar"
                            )}
                          </Button>
                        )}
                      {perfil === "Analista" && c.status === "Aprovacao" && (
                        <Button
                          size="small"
                          color="warning"
                          onClick={() => handleAcao(c.id, "revisar")}
                          sx={{ mr: 1 }}
                          disabled={acaoLoading === c.id + "revisar"}
                        >
                          {acaoLoading === c.id + "revisar" ? (
                            <CircularProgress size={18} />
                          ) : (
                            "Revisar"
                          )}
                        </Button>
                      )}
                      {perfil === "Analista" && c.status === "Aprovacao" && (
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleAcao(c.id, "reprovar")}
                          sx={{ mr: 1 }}
                          disabled={acaoLoading === c.id + "reprovar"}
                        >
                          {acaoLoading === c.id + "reprovar" ? (
                            <CircularProgress size={18} />
                          ) : (
                            "Reprovar"
                          )}
                        </Button>
                      )}
                      {perfil === "Analista" && c.status === "Aprovacao" && (
                        <Button
                          size="small"
                          color="info"
                          onClick={() => handleAcao(c.id, "agendar")}
                          sx={{ mr: 1 }}
                          disabled={acaoLoading === c.id + "agendar"}
                        >
                          {acaoLoading === c.id + "agendar" ? (
                            <CircularProgress size={18} />
                          ) : (
                            "Agendar"
                          )}
                        </Button>
                      )}
                      {perfil === "Executor" && c.status === "Agendamento" && (
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => handleAcao(c.id, "executar")}
                          sx={{ mr: 1 }}
                          disabled={acaoLoading === c.id + "executar"}
                        >
                          {acaoLoading === c.id + "executar" ? (
                            <CircularProgress size={18} />
                          ) : (
                            "Executar"
                          )}
                        </Button>
                      )}
                    </Box>
                  </Box>
                  <CalledActions
                    onInfo={() => {
                      setSelectedCalled(c);
                      setModalOpen(true);
                    }}
                    onExportPdf={() => exportPdf(c)}
                  />
                </Paper>
              );
            })
          )}
        </Stack>
      )}
      {/* Drawer de filtro e navegação para mobile */}
      {/* Drawer lateral (anchor left) só para menu, não para filtros no mobile */}
      {!isMobile && (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ width: 250, p: 2 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography variant="h6">Menu</Typography>
              <IconButton onClick={() => setDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              fullWidth
              sx={{ mb: 2 }}
            >
              Novo Chamado
            </Button>
            {/* ...outros itens do menu... */}
          </Box>
        </Drawer>
      )}
      {/* FAB para novo chamado no mobile - agora com texto "Novo Chamado" e navegação */}
      {isMobile && (
        <Fab
          color="primary"
          variant="extended"
          sx={{ position: "fixed", bottom: 24, right: 24 }}
          onClick={() => navigate("/calleds/novo")}
        >
          <AddIcon sx={{ mr: 1 }} />
          Novo Chamado
        </Fab>
      )}
      {/* No mobile, botão flutuante para abrir modal de filtro */}
      {isMobile && (
        <>
          <Fab
            color="primary"
            sx={{ position: "fixed", bottom: 88, right: 24 }}
            onClick={() => setDrawerOpen(true)}
          >
            <FilterListIcon />
          </Fab>
          <Drawer
            anchor="bottom"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <Box
              sx={{
                p: { xs: 1, sm: 2 },
                maxWidth: { xs: "95vw", sm: 400 },
                mx: "auto",
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Typography variant="h6">Filtrar Chamados</Typography>
                <IconButton onClick={() => setDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Stack direction="column" spacing={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={statusFiltro}
                    onChange={(e) => setStatusFiltro(e.target.value as string)}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="Criacao">Criação</MenuItem>
                    <MenuItem value="Aprovacao">Aprovação</MenuItem>
                    <MenuItem value="Agendamento">Agendamento</MenuItem>
                    <MenuItem value="Execucao">Execução</MenuItem>
                    <MenuItem value="Em Revisao">Em Revisão</MenuItem>
                    <MenuItem value="Reprovado">Reprovado</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <TextField
                    label="Solicitante"
                    variant="outlined"
                    size="small"
                    value={solicitanteFiltro}
                    onChange={(e) => setSolicitanteFiltro(e.target.value)}
                    placeholder="Digite o nome do solicitante"
                    fullWidth
                  />
                </FormControl>
                <MuiRangePicker
                  value={dataFiltro}
                  onChange={(dates) => setDataFiltro(dates ?? [null, null])}
                  placeholder={["Início", "Fim"]}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    fetchCalleds();
                    setDrawerOpen(false);
                  }}
                >
                  Aplicar filtro
                </Button>
                <Button
                  variant="text"
                  color="secondary"
                  fullWidth
                  sx={{ color: "text.secondary !important" }}
                  onClick={() => {
                    setStatusFiltro("");
                    setSolicitanteFiltro("");
                    setDataFiltro([null, null]);
                  }}
                >
                  Limpar
                </Button>
              </Stack>
            </Box>
          </Drawer>
        </>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            minWidth: 300,
          }}
        >
          {!!selectedCalled && (
            <>
              <Typography variant="h6" mb={1}>
                {selectedCalled?.titulo}
              </Typography>
              <Typography mb={1}>{selectedCalled?.descricao}</Typography>
              <Chip
                label={selectedCalled?.status}
                sx={{
                  mb: 1,
                  backgroundColor: getStatusColor(selectedCalled?.status || ""),
                  color: "#fff",
                }}
              />
              <Typography variant="body2">
                Solicitante: {selectedCalled?.solicitante?.nameUser}
              </Typography>
              <Typography variant="body2">
                Criado em:{" "}
                {selectedCalled?.criadoEm
                  ? new Date(selectedCalled.criadoEm).toLocaleString()
                  : ""}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default CalledsListPage;
