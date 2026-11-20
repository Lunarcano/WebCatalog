import { Product, ProductCategory } from '@/types/catalog';

const categoriaBebidas = 'Bebidas';
const categoriaGraosMassas = 'Grãos e Massas';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    nome: 'Refrigerante Cola 2L',
    descricao: 'Garrafa PET 2 litros gelada ou natural. Ideal para eventos e revenda.',
    precoUnitario: 8.50,
    precoFardo: 45.00,
    qtdPorFardo: 6,
    categoria: categoriaBebidas,
    imagemUrl: 'https://placehold.co/400x400/e2e8f0/1e293b?text=Refri+2L',
  },
  {
    id: 2,
    nome: 'Água Mineral sem Gás 500ml',
    descricao: 'Água mineral natural. Fardo fechado com 12 unidades.',
    precoUnitario: 2.00,
    precoFardo: 18.00,
    qtdPorFardo: 12,
    categoria: categoriaBebidas,
    imagemUrl: 'https://placehold.co/400x400/e2e8f0/1e293b?text=Agua+500ml',
  },
  {
    id: 3,
    nome: 'Suco Integral Laranja 1L',
    descricao: '100% fruta, sem adição de açúcares ou conservantes. Fardo com 6 unidades.',
    precoUnitario: 11.90,
    precoFardo: 64.00,
    qtdPorFardo: 6,
    categoria: categoriaBebidas,
    imagemUrl: 'https://placehold.co/400x400/e2e8f0/1e293b?text=Suco+1L',
  },
  {
    id: 4,
    nome: 'Cerveja Pilsen Lata 350ml',
    descricao: 'Lata 350ml puro malte. Fardo promocional com 12 latas.',
    precoUnitario: 4.50,
    precoFardo: 48.00,
    qtdPorFardo: 12,
    categoria: categoriaBebidas,
    imagemUrl: 'https://placehold.co/400x400/e2e8f0/1e293b?text=Cerveja+350ml',
  },
];