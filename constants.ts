import { Product, Promotion, ThemeTab, ColorPalette, Testimonial, SiteContent } from './types';

export const WHATSAPP_NUMBER = '5569992079671';
export const INSTAGRAM_URL = 'https://www.instagram.com/campoartesana/';

export const ADMIN_USERNAME = 'jamesjbg';
export const ADMIN_PASSWORD = 'Fuqu1c0*';

export const INITIAL_TABS: ThemeTab[] = [
  { id: 'home', title: 'Início' },
  { id: 'para-casa', title: 'Para Casa', description: 'Produtos personalizados que trazem aconchego e identidade para o seu lar.' },
  { id: 'corporativo', title: 'Brindes Corporativos', description: 'Soluções criativas e personalizadas para fortalecer a marca da sua empresa.' },
  { id: 'comemorativas', title: 'Datas Comemorativas', description: 'Presentes únicos para celebrar momentos especiais como Dia das Mães, Natal e aniversários.' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Tábua de Churrasco Personalizada',
    description: 'Tábua de madeira nobre com gravação a laser do seu nome, time ou logo. Perfeita para presentear e impressionar nos encontros.',
    price: 159.90,
    showPrice: true,
    imageUrl: 'https://picsum.photos/id/219/400/400',
    tabId: 'para-casa',
  },
  {
    id: '2',
    name: 'Copo Térmico com Gravação',
    description: 'Mantenha sua bebida na temperatura ideal com estilo. Personalizamos copos térmicos com nomes, frases ou logotipos de empresas.',
    price: 119.90,
    showPrice: true,
    imageUrl: 'https://picsum.photos/id/983/400/400',
    tabId: 'corporativo',
  },
  {
    id: '3',
    name: 'Placa de Maternidade em MDF',
    description: 'Um toque de carinho para o quarto do bebê. Placas em MDF com corte a laser e design personalizado com o nome da criança.',
    price: 89.90,
    showPrice: false,
    imageUrl: 'https://picsum.photos/id/1020/400/400',
    tabId: 'comemorativas',
  },
   {
    id: '4',
    name: 'Caixa para Vinho em MDF',
    description: 'Embalagem sofisticada para presentear com vinhos. Caixa em MDF com gravação a laser, ideal para brindes corporativos de fim de ano.',
    price: 75.00,
    showPrice: true,
    imageUrl: 'https://picsum.photos/id/1056/400/400',
    tabId: 'corporativo',
  },
];

export const INITIAL_PROMOTION: Promotion = {
  id: 'promo1',
  title: 'Personalize Seus Momentos ✨',
  description: 'Transformamos suas ideias em presentes únicos. Gravação e corte a laser em MDF, copos, tábuas e muito mais. Fale conosco!',
  imageUrl: 'https://picsum.photos/id/431/1200/400',
  active: true,
};

export const COLOR_PALETTES: ColorPalette[] = [
  {
    name: 'Rústico Chic',
    colors: { primary: '#A0522D', secondary: '#F5DEB3', accent: '#696969', 'base-100': '#FFFFFF', 'base-content': '#333333' },
  },
  {
    name: 'Moderno & Sutil',
    colors: { primary: '#4682B4', secondary: '#F0F8FF', accent: '#FFD700', 'base-100': '#FFFFFF', 'base-content': '#2F4F4F' },
  },
  {
    name: 'Vibrante',
    colors: { primary: '#D2691E', secondary: '#FFF8DC', accent: '#008080', 'base-100': '#FAFAFA', 'base-content': '#4B5563' },
  },
  {
    name: 'Clássico',
    colors: { primary: '#2F4F4F', secondary: '#DCDCDC', accent: '#BDB76B', 'base-100': '#F5F5F5', 'base-content': '#000000' },
  },
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
    { id: '1', author: 'Ana Silva', text: 'Amei a tábua de frios personalizada! Qualidade impecável e a gravação ficou perfeita. Superou minhas expectativas!' },
    { id: '2', author: 'Carlos Pereira - TechCorp', text: 'Os brindes corporativos fizeram sucesso no nosso evento. A CAMPOARTESANA entregou tudo no prazo e com um acabamento excelente.' },
    { id: '3', author: 'Mariana Costa', text: 'O presente do Dia dos Pais ficou incrível. Meu pai adorou o copo térmico com o nome dele. Atendimento nota 10!' },
];

export const INITIAL_SITE_CONTENT: SiteContent = {
    id: 'main_content',
    companyName: 'CAMPOARTESANA',
    about: 'Na CAMPOARTESANA, nossa paixão é transformar madeira e outros materiais em peças únicas e cheias de significado. Desde 2020, nos dedicamos a criar presentes personalizados e brindes corporativos que contam histórias e marcam momentos. Cada peça é feita com cuidado, precisão e um toque de criatividade, utilizando tecnologia de corte e gravação a laser para garantir um acabamento perfeito. Celebre conosco e transforme suas ideias em realidade!',
    featuredProductsTitle: 'Nossos Destaques',
    logoUrl: '',
    whatsappNumber: '5569992079671',
    // FIX: Added 'whatsappMessage' to match the updated SiteContent interface and provide a default value.
    whatsappMessage: 'Olá! Tenho interesse nos seus produtos.',
};