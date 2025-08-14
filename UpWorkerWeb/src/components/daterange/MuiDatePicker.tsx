import React from "react";
import { Box, Button, Popover, IconButton } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { DatePicker } from "@mui/x-date-pickers";

export interface MuiDatePickerProps {
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
  placeholder?: string;
  error?: boolean;
}

const MuiDatePicker: React.FC<MuiDatePickerProps> = ({
  value,
  onChange,
  placeholder = "Data de execução",
  error,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selected, setSelected] = React.useState<Dayjs | null>(value);

  dayjs.locale("pt-br");

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChange = (date: Dayjs | null) => {
    setSelected(date);
  };
  const handleConfirm = () => {
    onChange(selected);
    handleClose();
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2}>
        <Button
          variant="outlined"
          onClick={handleOpen}
          sx={{
            minWidth: 180,
            textTransform: "none",
            borderColor: error ? "error.main" : "#ff9800",
            color: "#ff9800",
          }}
        >
          {selected ? selected.format("DD/MM/YYYY") : placeholder}
        </Button>
        <IconButton onClick={handleOpen} sx={{ color: "#ff9800" }}>
          <CalendarMonthIcon />
        </IconButton>
      </Box>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box p={2}>
          <DatePicker
            value={selected}
            onChange={handleChange}
            format="DD/MM/YYYY"
            slotProps={{ textField: { fullWidth: true, error } }}
            minDate={dayjs("2000-01-01")}
            maxDate={dayjs("2100-12-31")}
          />
          <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
            <Button onClick={() => setSelected(null)}>Limpar</Button>
            <Button
              onClick={handleConfirm}
              disabled={!selected}
              variant="contained"
              sx={{ bgcolor: "#ff9800", color: "#fff" }}
            >
              Confirmar
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default MuiDatePicker;
