import React, { useEffect, useState } from "react";
import { DatePicker, Space } from "antd";
import "antd/dist/reset.css";
import "./OrangeRangePicker.css";
import { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

// Permite todas as props do RangePicker
export interface OrangeRangePickerProps
  extends React.ComponentProps<typeof RangePicker> {
  value: [Dayjs | null, Dayjs | null] | null;
  onChange: (
    dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string],
  ) => void;
  placeholder?: [string, string];
}

const OrangeRangePicker: React.FC<OrangeRangePickerProps> = (props) => {
  // Responsividade dinâmica
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Resumo do range selecionado
  const { value } = props;
  let resumo = "";
  if (value && value[0] && value[1]) {
    resumo = `Selecionado: ${value[0].format("DD/MM/YYYY")} a ${value[1].format("DD/MM/YYYY")}`;
  }
  // Validação visual: range inválido (data final antes da inicial)
  const isInvalid =
    value && value[0] && value[1] && value[1].isBefore(value[0], "day");
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <RangePicker
        style={{
          width: "100%",
          zIndex: 1200,
          position: "relative",
          height: isMobile ? 48 : 40,
          borderRadius: 4,
          border: isInvalid ? "2px solid #d32f2f" : "1px solid #c4c4c4",
          background: "#fff",
          fontFamily: "Roboto, Arial, sans-serif",
          fontSize: isMobile ? 18 : 16,
          padding: isMobile ? "0 16px" : "0 12px",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
        }}
        className={`orange-range-picker${isInvalid ? " ant-picker-input-invalid" : ""}`}
        getPopupContainer={(trigger) => document.body}
        {...props}
      />
      {resumo && <div className="orange-range-picker-summary">{resumo}</div>}
      {isInvalid && (
        <div
          style={{
            color: "#d32f2f",
            fontWeight: "bold",
            fontSize: "0.95em",
            marginTop: 2,
          }}
        >
          Data final não pode ser anterior à inicial.
        </div>
      )}
    </Space>
  );
};

export default OrangeRangePicker;
