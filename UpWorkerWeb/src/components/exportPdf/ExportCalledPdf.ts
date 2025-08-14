import jsPDF from "jspdf";

export function exportCalledPdf({
  id,
  uuid,
  titulo,
  descricao,
  tipoChamado,
  tipoMudanca,
  ambiente,
  executor,
  aprovador,
  dataExecucaoInicio,
  dataExecucaoFim,
  script,
  emergencial,
  solicitante,
  anexo,
  criadoEm,
}: any) {
  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("GMUD", 20, 18);
  doc.setFontSize(18);
  doc.text("Solicitação de Mudança", 20, 28);
  doc.setLineWidth(0.5);
  doc.line(20, 32, 190, 32);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`ID: ${id ?? "-"}`, 20, 38);
  doc.text(`UUID: ${uuid ?? "-"}`, 20, 45);
  doc.text(`Título: ${titulo ?? "-"}`, 20, 52);
  doc.text(`Tipo de chamado: ${tipoChamado ?? "-"}`, 20, 59);
  doc.text(`Tipo de mudança: ${tipoMudanca ?? "-"}`, 20, 66);
  doc.text(`Ambiente: ${ambiente ?? "-"}`, 20, 73);
  doc.text(`Executor: ${executor ?? "-"}`, 20, 80);
  doc.text(`Aprovador: ${aprovador ?? "-"}`, 20, 87);
  doc.text(`Solicitante: ${solicitante ?? "-"}`, 20, 94);
  doc.text(
    `Criado em: ${criadoEm ? new Date(criadoEm).toLocaleString() : "-"}`,
    20,
    101,
  );
  // Campo 'Descrição' aparece apenas uma vez, por último
  // Função auxiliar para validar datas
  function formatDateSafe(dateStr: any) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "-" : d.toLocaleString();
  }
  doc.text(
    `Execução: ${formatDateSafe(dataExecucaoInicio)} até ${formatDateSafe(dataExecucaoFim)}`,
    20,
    115,
  );
  doc.setFont("helvetica", emergencial ? "bold" : "normal");
  doc.setTextColor(emergencial ? "#d32f2f" : "#333");
  doc.text(`Emergencial: ${emergencial ? "Sim" : "Não"}`, 20, 122);
  doc.setTextColor("#333");
  doc.setFont("helvetica", "normal");
  if (anexo) {
    doc.text(`Anexo: ${anexo.name ?? anexo} (não incluso no PDF)`, 20, 129);
  }
  doc.setLineWidth(0.2);
  doc.line(20, 134, 190, 134);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Script da Mudança:", 20, 142);
  doc.setFontSize(10);
  doc.setFont("courier", "normal");
  const scriptLines = (script ?? "").split("\n");
  let yScript = 149;
  scriptLines.forEach((line) => {
    doc.text(line, 20, yScript, { maxWidth: 170 });
    yScript += 6;
  });
  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  doc.setTextColor("#666");
  doc.text(
    "Documento gerado automaticamente para revisão e aprovação.",
    20,
    270,
  );
  doc.setTextColor("#333");
  doc.save(`GMUD_${id ?? uuid ?? "chamado"}.pdf`);
}
