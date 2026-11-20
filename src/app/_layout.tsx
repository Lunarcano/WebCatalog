// Importando tailwind para garantir a renderização em todas as páginas 
import '../../global.css'; 
import { Stack } from 'expo-router';

// Usando o stack para facilitar o desenvolvimento da página de adm futuramente
export default function RootLayout() { 
  // Escondendo o header padrão com screenOptions
  return <Stack screenOptions={{ headerShown: false }} />; 
}