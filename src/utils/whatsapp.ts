import { CartItem } from '@/types/catalog';
import { Linking } from 'react-native';
import { formatCurrency } from './formatCurrency';

// Número ficticio por enquanto
const WHATSAPP_NUMBER = '5581999999999';

// Função para montar a mensagem com o pedido do carrinho
export function buildWhatsAppMessage(items: CartItem[], total: number): string {
  const header = 'Olá! Gostaria de fazer o seguinte pedido pelo catálogo:\n\n';

  const lines = items.map((item) => {
    const unitPrice =
      item.tipo === 'fardo'
        ? item.product.precoFardo
        : item.product.precoUnitario;
    const subtotal = unitPrice * item.quantidade;
    const modality =
      item.tipo === 'fardo'
        ? `Fardo c/ ${item.product.qtdPorFardo} un.`
        : 'Unidade';

    return `• ${item.quantidade}x *${item.product.nome}* (${modality}) — ${formatCurrency(subtotal)}`;
  });

  const footer = `\n\n*Total estimado:* ${formatCurrency(total)}\n\nAguardo confirmação!`;

  return header + lines.join('\n') + footer;
}

export async function sendOrderToWhatsApp(
  items: CartItem[],
  total: number
): Promise<void> {
  if (items.length === 0) return;

  const message = buildWhatsAppMessage(items, total);
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  await Linking.openURL(url);
}