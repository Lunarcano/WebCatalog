import React, { ComponentRef, useMemo, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CartOverlay } from '@/components/CartOverlay';
import { ProductOverlay } from '@/components/ProductOverlay';
import { CartItem, Product } from '@/types/catalog';
import { formatCurrency } from '@/utils/formatCurrency';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { 
  CartIcon, 
  UserIcon, 
  WhatsAppIcon, 
  SearchIcon, 
} from '@/components/Icons';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Image,
  useWindowDimensions,
} from 'react-native';



// const LOGO_SOURCE = require('../../assets/images/logo.jpg'); 
const BANNER_SOURCE = require('../../assets/images/banner.jpg');

export default function HomeScreen() {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const searchInputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Tratamento para o banner ficar responsivo
  const { width: screenWidth } = useWindowDimensions();
  const bannerWidth = Math.min(screenWidth - 32, 1152);
  const bannerHeight = Math.min(bannerWidth / 2, 490);

  

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (p) =>
        p.nome.toLowerCase().includes(term) ||
        p.descricao.toLowerCase().includes(term) ||
        (p.categoria ?? '').toLowerCase().includes(term)
    );
  }, [products, search]);

  const categoriesEntries = useMemo(() => {
    const grouped = filteredProducts.reduce<Record<string, Product[]>>(
      (acc, product) => {
        const cat = product.categoria?.trim() || 'Outros';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
      },
      {}
    );
    return Object.entries(grouped);
  }, [filteredProducts]);

  const totalItemsInCart = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantidade, 0),
    [cart]
  );

  const handleAddToCart = (
    product: Product,
    tipo: 'unitario' | 'fardo',
    quantidade: number
  ) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) => item.product.id === product.id && item.tipo === tipo
      );
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantidade: updated[idx].quantidade + quantidade,
        };
        return updated;
      }
      return [...prev, { product, tipo, quantidade }];
    });
  };

  const handleUpdateQuantity = (
    productId: number,
    tipo: 'unitario' | 'fardo',
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId && item.tipo === tipo
            ? { ...item, quantidade: item.quantidade + delta }
            : item
        )
        .filter((item) => item.quantidade > 0)
    );
  };

  const handleClearCart = () => setCart([]);

  return (
    <SafeAreaView className="flex-1 bg-[#cde8c4]">
      <ScrollView
        className="flex-1 w-full"
        contentContainerClassName="pb-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-5xl mx-auto px-3 sm:px-6 pt-3 gap-4 min-w-0">
          {/* HEADER com logo à esquerda + ícones à direita */}
          <View className="flex-row items-center justify-between gap-2 min-w-0">
            {/* PLACEHOLDER LOGO: troque este bloco por <Image source={...} /> */}
            <View className="flex-row items-center gap-2 min-w-0">
              <View className="w-10 h-10 rounded-full bg-emerald-800 items-center justify-center shrink-0">
                <Text className="text-white font-extrabold text-sm">MD</Text>
              </View>

              <Text
                numberOfLines={1}
                className="text-sm sm:text-base font-extrabold text-emerald-950 shrink"
              >
                MERCADINHO DO DARIO
              </Text>
            </View>

            <View className="flex-row items-center gap-2 shrink-0">
              <Pressable
                accessibilityLabel="Perfil"
                className="w-9 h-9 rounded-full bg-white/70 items-center justify-center"
              >
                <UserIcon size={18} color="#022c22" />
              </Pressable>

              <Pressable
                onPress={() => setIsCartOpen(true)}
                accessibilityLabel="Abrir carrinho"
                className="h-9 px-3 rounded-full bg-emerald-900 items-center justify-center flex-row gap-1.5"
              >
                <CartIcon size={17} color="#ffffff" />
                <Text className="text-white font-bold text-xs">
                  {totalItemsInCart}
                </Text>
              </Pressable>
            </View>
          </View>

          
          {/* Banner estilizado */}
          <View
            className="w-full rounded-2xl bg-[#d8eed0] border border-emerald-900/15"
            style={{ overflow: 'hidden' }}
          >
            <Image
              source={BANNER_SOURCE}
              resizeMode="contain"
              accessibilityLabel="Banner promocional Mercadinho do Dario"
              style={{ width: '100%', height: bannerHeight }}
            />
          </View> 

          {/* Busca de Produtos */}
          <Pressable
            onPress={() => searchInputRef.current?.focus()}
            className={`w-full flex-row items-center bg-white/95 px-3.5 rounded-xl gap-2.5 min-w-0 border ${
              isSearchFocused
                ? 'border-emerald-800 ring-2 ring-emerald-700/30'
                : 'border-emerald-900/15'
            }`}
          >
            <SearchIcon size={18} color={isSearchFocused ? '#065f46' : '#4b6b52'} />
            <TextInput
              ref={searchInputRef}
              value={search}
              onChangeText={setSearch}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Buscar produto ou categoria..."
              placeholderTextColor="#4b6b52"
              className="flex-1 py-2.5 text-emerald-950 text-sm min-w-0 outline-none focus:outline-none"
            />
          </Pressable>

          {/* Seções categorizadas pelo tipo de produto */}
          {categoriesEntries.length === 0 ? (
            <View className="py-12 items-center">
              <Text className="text-emerald-950 font-semibold text-sm">
                Nenhum produto encontrado.
              </Text>
            </View>
          ) : (
            categoriesEntries.map(([categoryName, items]) => (
              <View key={categoryName} className="gap-2.5 min-w-0">
                <Text className="text-base sm:text-lg font-extrabold text-emerald-950">
                  {categoryName}
                </Text>

                <View className="flex-row flex-wrap w-full">
                  {items.map((product) => (
                    <View
                      key={product.id}
                      className="w-1/3 md:w-1/4 lg:w-1/5 p-1 sm:p-1.5 min-w-0"
                    >
                      <Pressable
                        onPress={() => setSelectedProduct(product)}
                        className="bg-white rounded-xl p-2 border border-emerald-900/10 items-center justify-between flex-1"
                      >
                        <View className="w-full aspect-square rounded-lg bg-slate-100 items-center justify-center overflow-hidden mb-1.5">
                          <Text
                            numberOfLines={2}
                            className="text-[11px] font-bold text-slate-600 text-center px-1"
                          >
                            {product.nome}
                          </Text>
                        </View>

                        <View className="w-full min-w-0">
                          <Text
                            numberOfLines={1}
                            className="text-[11px] font-semibold text-slate-800"
                          >
                            {product.nome}
                          </Text>
                          <Text
                            numberOfLines={1}
                            className="text-xs font-extrabold text-emerald-900 mt-0.5"
                          >
                            {formatCurrency(product.precoUnitario)}
                          </Text>
                        </View>
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <ProductOverlay
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartOverlay
        visible={isCartOpen}
        items={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
      />
    </SafeAreaView>
  );
}