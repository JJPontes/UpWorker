import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InfoIcon from "@mui/icons-material/Info";
import { Stack, IconButton } from "@mui/material";
import React from "react";

export function CalledActions({
  onInfo,
  onExportPdf,
}: {
  onInfo: () => void;
  onExportPdf: () => void;
}) {
  return (
    <Stack direction="column" spacing={1} alignItems="center">
      <IconButton onClick={onExportPdf} size="small" sx={{ color: "#ff9800" }}>
        <PictureAsPdfIcon />
      </IconButton>
      <IconButton color="default" onClick={onInfo} size="small">
        <InfoIcon />
      </IconButton>
    </Stack>
  );
}
