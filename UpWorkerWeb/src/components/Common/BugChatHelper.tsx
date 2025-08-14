import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
  Stack,
} from "@mui/material";

interface BugChatHelperProps {
  description: string;
  visible: boolean;
  rules?: string[];
}

const BugChatHelper: React.FC<BugChatHelperProps> = ({
  description,
  visible,
  rules,
}) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!visible || !description || description.length < 10) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    setError("");
    // Call backend API for bug description analysis
    fetch("/api/bug-analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions);
        } else {
          setSuggestions([]);
        }
      })
      .catch(() => {
        setError("Erro ao analisar descrição do bug.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [description, visible]);

  if (!visible) return null;

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
      <Box display="flex" alignItems="center" mb={1}>
        <Avatar sx={{ bgcolor: "#1976d2", mr: 1 }}>🤖</Avatar>
        <Typography variant="subtitle1" fontWeight={600}>
          Dicas para descrição de bug
        </Typography>
      </Box>
      {/* Regras fixas */}
      {Array.isArray(rules) && rules.length > 0 && (
        <Box mb={1}>
          <Typography variant="body2" fontWeight={500} color="primary">
            Siga estas boas práticas:
          </Typography>
          <Stack spacing={0.5}>
            {rules.map((rule) => (
              <Typography key={rule} variant="body2">
                - {rule}
              </Typography>
            ))}
          </Stack>
        </Box>
      )}
      {loading && <CircularProgress size={24} />}
      {!loading && error && <Typography color="error">{error}</Typography>}
      {!loading && !error && suggestions.length > 0 && (
        <Stack spacing={1}>
          {suggestions.map((s) => (
            <Typography key={s} variant="body2">
              • {s}
            </Typography>
          ))}
        </Stack>
      )}
      {!loading && !error && suggestions.length === 0 && (
        <Typography variant="body2" color="textSecondary">
          Nenhuma sugestão encontrada. Tente detalhar mais o problema.
        </Typography>
      )}
    </Paper>
  );
};

export default BugChatHelper;
