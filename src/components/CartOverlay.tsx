import React from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { CartItem } from '@/types/catalog';
import { formatCurrency } from '@/utils/formatCurrency';
import { sendOrderToWhatsApp } from '@/utils/whatsapp';
import {  WhatsAppIcon } from '@/components/Icons';

interface CartOverlayProps {
  visible: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (
    productId: number,
    tipo: 'unitario' | 'fardo',
    delta: number
  ) => void;
  onClearCart: () => void;
}

export function CartOverlay({
  visible,
  items,
  onClose,
  onUpdateQuantity,
  onClearCart,
}: CartOverlayProps) {
  if (!visible) return null;

  const total = items.reduce((acc, item) => {
    const price =
      item.tipo === 'fardo'
        ? item.product.precoFardo
        : item.product.precoUnitario;
    return acc + price * item.quantidade;
  }, 0);

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantidade, 0);

  const handleCheckout = () => {
    sendOrderToWhatsApp(items, total);
  };

  return (
    <View className="fixed inset-0 z-50 bg-black/60 flex-row justify-end">
      {/* Área clicável à esquerda para fechar */}
      <Pressable onPress={onClose} className="flex-1" />

      {/* Gaveta lateral do Carrinho */}
      <View className="bg-white w-full max-w-md h-full shadow-2xl flex-col justify-between z-10">
        {/* Cabeçalho do Carrinho */}
        <View className="p-5 border-b border-slate-200 flex-row items-center justify-between bg-slate-50">
          <View>
            <Text className="text-xl font-extrabold text-slate-900">
              Seu Carrinho
            </Text>
            <Text className="text-xs text-slate-500 mt-0.5">
              {totalItemsCount === 0
                ? 'Nenhum item adicionado'
                : `${totalItemsCount} ${totalItemsCount === 1 ? 'item' : 'itens'} selecionados`}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            {items.length > 0 && (
              <Pressable
                onPress={onClearCart}
                className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100"
              >
                <Text className="text-xs font-semibold text-red-600">
                  Limpar
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={onClose}
              className="w-9 h-9 rounded-full bg-slate-200/80 hover:bg-slate-300 items-center justify-center"
            >
              <Text className="text-slate-800 font-bold text-base">✕</Text>
            </Pressable>
          </View>
        </View>

        {/* Listagem de Produtos */}
        <ScrollView
          className="flex-1 p-5"
          showsVerticalScrollIndicator={false}
        >
          {items.length === 0 ? (
            <View className="py-20 items-center justify-center">
              <Text className="text-base font-semibold text-slate-600 mb-1">
                Seu carrinho está vazio
              </Text>
              <Text className="text-xs text-slate-400 text-center max-w-xs">
                Clique nos produtos em promoção na vitrine para escolher entre unidade ou fardo.
              </Text>
            </View>
          ) : (
            <View className="gap-3 pb-6">
              {items.map((item) => {
                const unitPrice =
                  item.tipo === 'fardo'
                    ? item.product.precoFardo
                    : item.product.precoUnitario;
                const subtotal = unitPrice * item.quantidade;

                return (
                  <View
                    key={`${item.product.id}-${item.tipo}`}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white flex-row items-center gap-3"
                  >
                    <Image
                      source={{ uri: item.product.imagemUrl }}
                      className="w-16 h-16 rounded-xl bg-slate-100"
                      resizeMode="cover"
                    />

                    <View className="flex-1">
                      <Text
                        numberOfLines={1}
                        className="font-bold text-sm text-slate-900"
                      >
                        {item.product.nome}
                      </Text>

                      <View className="flex-row items-center gap-1.5 mt-0.5">
                        <View
                          className={`px-2 py-0.5 rounded-md ${
                            item.tipo === 'fardo'
                              ? 'bg-emerald-100'
                              : 'bg-slate-100'
                          }`}
                        >
                          <Text
                            className={`text-[10px] font-bold uppercase ${
                              item.tipo === 'fardo'
                                ? 'text-emerald-700'
                                : 'text-slate-600'
                            }`}
                          >
                            {item.tipo === 'fardo'
                              ? `Fardo (${item.product.qtdPorFardo} un)`
                              : 'Unitário'}
                          </Text>
                        </View>
                        <Text className="text-xs text-slate-400">
                          {formatCurrency(unitPrice)} cada
                        </Text>
                      </View>

                      <View className="flex-row items-center justify-between mt-2.5">
                        {/* Controles - / + */}
                        <View className="flex-row items-center bg-slate-100 rounded-lg p-0.5">
                          <Pressable
                            onPress={() =>
                              onUpdateQuantity(item.product.id, item.tipo, -1)
                            }
                            className="w-7 h-7 items-center justify-center rounded-md bg-white shadow-sm"
                          >
                            <Text className="text-sm font-bold text-slate-700">
                              −
                            </Text>
                          </Pressable>

                          <Text className="w-8 text-center font-bold text-xs text-slate-900">
                            {item.quantidade}
                          </Text>

                          <Pressable
                            onPress={() =>
                              onUpdateQuantity(item.product.id, item.tipo, 1)
                            }
                            className="w-7 h-7 items-center justify-center rounded-md bg-white shadow-sm"
                          >
                            <Text className="text-sm font-bold text-slate-700">
                              +
                            </Text>
                          </Pressable>
                        </View>

                        <Text className="font-extrabold text-sm text-slate-900">
                          {formatCurrency(subtotal)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Rodapé com Somatório e Botão WhatsApp */}
        {items.length > 0 && (
          <View className="p-5 border-t border-slate-200 bg-slate-50">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-sm font-semibold text-slate-600">
                Total do Pedido
              </Text>
              <Text className="text-2xl font-extrabold text-slate-900">
                {formatCurrency(total)}
              </Text>
            </View>

            <Pressable
              onPress={handleCheckout}
              className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 py-3.5 px-5 rounded-xl items-center justify-center shadow-sm"
            >
              <View className='flex-row items-center justify-between gap-2 min-w-0'>
              <Text className="text-white font-bold text-base">
                Seguir para o WhatsApp
              </Text>
              <WhatsAppIcon size={18}/>
              </View>
              
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}