import { Product } from '@/types/catalog';
import { formatCurrency } from '@/utils/formatCurrency';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

interface ProductOverlayProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    tipo: 'unitario' | 'fardo',
    quantidade: number
  ) => void;
}

export function ProductOverlay({
  product,
  onClose,
  onAddToCart,
}: ProductOverlayProps) {
  const [tipo, setTipo] = useState<'unitario' | 'fardo'>('fardo');
  const [quantidade, setQuantidade] = useState<number>(1);

  useEffect(() => {
    if (product) {
      setTipo('fardo');
      setQuantidade(1);
    }
  }, [product]);

  if (!product) return null;

  const precoSelecionado =
    tipo === 'fardo' ? product.precoFardo : product.precoUnitario;
  const subtotal = precoSelecionado * quantidade;
  const economiaPorFardo =
    product.precoUnitario * product.qtdPorFardo - product.precoFardo;

  const handleConfirm = () => {
    onAddToCart(product, tipo, quantidade);
    onClose();
  };

  return (
    <View className="fixed inset-0 z-50 bg-black/60 items-center justify-center p-4">
      <Pressable
        onPress={onClose}
        className="absolute inset-0"
      />

      <View className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl max-h-[90%] z-10">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="relative h-56 bg-slate-100">
            <Image
              source={{ uri: product.imagemUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <Pressable
              onPress={onClose}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white w-9 h-9 rounded-full items-center justify-center shadow"
            >
              <Text className="text-slate-800 font-bold text-base">✕</Text>
            </Pressable>
          </View>

          <View className="p-6">
            <Text className="text-2xl font-extrabold text-slate-900 mb-2">
              {product.nome}
            </Text>
            <Text className="text-sm text-slate-600 leading-relaxed mb-6">
              {product.descricao}
            </Text>

            <Text className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Escolha a opção de compra
            </Text>

            <View className="gap-3 mb-6">
              <Pressable
                onPress={() => setTipo('fardo')}
                className={`p-4 rounded-2xl border-2 flex-row items-center justify-between ${
                  tipo === 'fardo'
                    ? 'border-emerald-600 bg-emerald-50/70'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <View className="flex-1 pr-2">
                  <Text className="font-bold text-base text-slate-900">
                    Fardo Promocional ({product.qtdPorFardo} un.)
                  </Text>
                  {economiaPorFardo > 0 && (
                    <Text className="text-xs font-semibold text-emerald-700 mt-0.5">
                      Economize {formatCurrency(economiaPorFardo)} por fardo
                    </Text>
                  )}
                </View>
                <Text className="text-lg font-extrabold text-emerald-700">
                  {formatCurrency(product.precoFardo)}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setTipo('unitario')}
                className={`p-4 rounded-2xl border-2 flex-row items-center justify-between ${
                  tipo === 'unitario'
                    ? 'border-emerald-600 bg-emerald-50/70'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <View>
                  <Text className="font-bold text-base text-slate-900">
                    Compra Unitária
                  </Text>
                  <Text className="text-xs text-slate-500 mt-0.5">
                    1 unidade avulsa
                  </Text>
                </View>
                <Text className="text-lg font-bold text-slate-800">
                  {formatCurrency(product.precoUnitario)}
                </Text>
              </Pressable>
            </View>

            <View className="flex-row items-center gap-3 pt-4 border-t border-slate-100">
              <View className="flex-row items-center bg-slate-100 rounded-xl p-1">
                <Pressable
                  onPress={() => setQuantidade((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 items-center justify-center rounded-lg bg-white shadow-sm"
                >
                  <Text className="text-lg font-bold text-slate-700">−</Text>
                </Pressable>

                <Text className="w-10 text-center font-bold text-base text-slate-900">
                  {quantidade}
                </Text>

                <Pressable
                  onPress={() => setQuantidade((q) => q + 1)}
                  className="w-10 h-10 items-center justify-center rounded-lg bg-white shadow-sm"
                >
                  <Text className="text-lg font-bold text-slate-700">+</Text>
                </Pressable>
              </View>

              <Pressable
                onPress={handleConfirm}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 h-12 rounded-xl items-center justify-center px-4 shadow-sm"
              >
                <Text className="text-white font-bold text-sm">
                  Adicionar • {formatCurrency(subtotal)}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}