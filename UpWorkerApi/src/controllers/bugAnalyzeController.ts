import nlp from 'compromise';

export function avaliarDescricaoBug(descricao: string): { ok: boolean, sugestao?: string } {
  if (!descricao) return { ok: false, sugestao: "Descreva o sistema, o ocorrido e o que espera." };
  const doc = nlp(descricao);
  const sistemas = ["sistema", "app", "aplicativo", "site", "plataforma", "módulo", "painel"];
  const ocorridos = ["erro", "falha", "problema", "bug", "travou", "não funciona", "parou", "exceção", "crash", "quebrou", "inconsistência"];
  const desejos = ["gostaria", "preciso", "solicito", "quero", "necessito", "favor", "arrumar", "resolver", "corrigir", "ajuda"];
  const hasVerb = doc.verbs().out('array').length > 0;
  const hasSystem = sistemas.some(p => doc.has(p));
  const hasProblem = ocorridos.some(p => doc.has(p));
  const hasWish = desejos.some(p => doc.has(p));
  if (hasVerb && hasSystem && hasProblem && hasWish) return { ok: true };
  let sugestao = "Sugestão: cite o sistema afetado, descreva o ocorrido e o que espera.\nExemplo: 'No sistema X, ocorreu um erro ao salvar. Gostaria que fosse corrigido.'";
  return { ok: false, sugestao };
}
