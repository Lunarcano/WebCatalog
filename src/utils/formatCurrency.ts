// Utilitário para garantir a formatação da moeda pro padrão BRL (R$ 0,00)
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}