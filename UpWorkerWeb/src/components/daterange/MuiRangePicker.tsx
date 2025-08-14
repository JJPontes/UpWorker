import React, { useState } from "react";
import "./OrangeRangePicker.css";
import { Box, Typography, IconButton, Popover, Button } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { PickersDay, StaticDatePicker } from "@mui/x-date-pickers";

export interface MuiRangePickerProps {
  value: [Dayjs | null, Dayjs | null];
  onChange: (dates: [Dayjs | null, Dayjs | null]) => void;
  placeholder?: [string, string];
  error?: boolean;
}

const MuiRangePicker: React.FC<MuiRangePickerProps> = ({
  value,
  onChange,
  placeholder = ["Data inicial", "Data final"],
  error,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  dayjs.locale("pt-br");
  const defaultStart = dayjs();
  const defaultEnd = dayjs().add(1, "day");
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null]>(
    value[0] && value[1] ? value : [defaultStart, defaultEnd],
  );
  const [selecting, setSelecting] = useState<"start" | "end">("start");

  // Abre calendário
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    // Se não houver seleção, sugere hoje e amanhã
    if (!range[0] && !range[1]) {
      setRange([defaultStart, defaultEnd]);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
    setSelecting("start");
  };

  // Seleção customizada de range
  const handleDayClick = (date: Dayjs | null) => {
    if (!date) return;
    if (selecting === "start") {
      setRange([date, null]);
      setSelecting("end");
    } else {
      if (range[0] && date.isBefore(range[0], "day")) {
        setRange([date, null]);
        setSelecting("end");
        return;
      }
      setRange([range[0], date]);
      setSelecting("start");
    }
  };

  // Confirma seleção
  const handleConfirm = () => {
    onChange(range);
    handleClose();
  };

  // Resumo removido para evitar repetição
  const isInvalid = range[0] && range[1] && range[1].isBefore(range[0], "day");

  // Renderização customizada dos dias
  const renderDay = (day, _value, DayComponentProps) => {
    const isStart = range[0] && day.isSame(range[0], "day");
    const isEnd = range[1] && day.isSame(range[1], "day");
    const isInRange =
      range[0] &&
      range[1] &&
      day.isAfter(range[0], "day") &&
      day.isBefore(range[1], "day");
    let sx = {};
    if (isStart || isEnd) {
      sx = {
        bgcolor: "#ff9800",
        color: "#fff",
        borderRadius: "50%",
      };
    } else if (isInRange) {
      sx = {
        bgcolor: "#ffe0b2",
      };
    }
    return <PickersDay {...DayComponentProps} sx={sx} />;
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
            borderColor: error || isInvalid ? "error.main" : "#ff9800",
            color: "#ff9800",
          }}
        >
          {range[0] ? range[0].format("DD/MM/YYYY") : placeholder[0]}{" "}
          {range[1] ? ` - ${range[1].format("DD/MM/YYYY")}` : ""}
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
          {/* Esconde botões padrão do MUI DatePicker */}
          <style>{`
            .MuiPickersLayout-actionBar button {
              display: none !important;
            }
            .MuiPickersCalendarHeader-label {
              text-transform: capitalize !important;
            }
            .MuiPickersCalendarHeader-daysContainer .MuiTypography-root {
              text-transform: capitalize !important;
              width: 32px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 0.95em;
            }
          `}</style>
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            value={range[selecting === "start" ? 0 : 1] || dayjs()}
            onChange={(date) => handleDayClick(date)}
            slots={{
              day: (props) => renderDay(props.day, props.selected, props),
            }}
            minDate={dayjs("2000-01-01")}
            maxDate={dayjs("2100-12-31")}
            showToolbar={false}
          />
          <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
            <Button
              onClick={() => {
                setRange([null, null]);
                setSelecting("start");
              }}
            >
              Limpar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!(!!range[0] && !!range[1] && !isInvalid)}
              variant="contained"
              sx={{ bgcolor: "#ff9800", color: "#fff" }}
            >
              Confirmar
            </Button>
          </Box>
        </Box>
      </Popover>
      {/* Resumo removido */}
      {isInvalid && (
        <Typography
          color="error"
          fontWeight="bold"
          fontSize="0.95em"
          sx={{ mt: 0.5 }}
        >
          Data final não pode ser anterior à inicial.
        </Typography>
      )}
    </Box>
  );
};

export default MuiRangePicker;
