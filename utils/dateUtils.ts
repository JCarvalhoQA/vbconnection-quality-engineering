export function formatarDataPtBr(data: Date): string {
  return data.toLocaleDateString('pt-BR');
}

export function formatarDataWs(data = new Date()): number {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return Number(`${ano}${mes}${dia}`);
}

export function somarDias(dataBase: Date, dias: number): Date {
  const data = new Date(dataBase);
  data.setDate(data.getDate() + dias);
  return data;
}

export function somarMeses(dataBase: Date, meses: number): Date {
  const data = new Date(dataBase);
  data.setMonth(data.getMonth() + meses);
  return data;
}

export function somarMesesHoje(quantidadeMeses: number): Date {
  return somarMeses(new Date(), quantidadeMeses);
}
