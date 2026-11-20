export interface Product {
  id: number;
  nome: string;
  descricao: string;
  precoUnitario: number;
  precoFardo: number;
  qtdPorFardo: number;
  imagemUrl: string;
  categoria?: ProductCategory;
}

export interface CartItem {
  product: Product;
  tipo: 'unitario' | 'fardo';
  quantidade: number;
}

export type ProductCategory =
  | 'Bebidas'
  | 'Grãos e Massas';