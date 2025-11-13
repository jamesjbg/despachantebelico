
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  showPrice: boolean;
  imageUrl: string; // Can be a URL or a Base64 string
  tabId: string;
}

export interface Promotion {
  id: string;
  title: string;
  description:string;
  imageUrl: string; // Can be a URL or a Base64 string
  active: boolean;
}

export interface ThemeTab {
  id: string;
  title: string;
  description?: string;
}

export interface ColorPalette {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    'base-100': string;
    'base-content': string;
  };
}

export interface Testimonial {
  id: string;
  author: string;
  text: string;
  imageUrl?: string; // Optional author image (URL or Base64)
}

export interface SiteContent {
  id: string;
  companyName: string;
  about: string;
  featuredProductsTitle: string;
  logoUrl?: string;
  whatsappNumber?: string;
  // FIX: Added missing 'whatsappMessage' property to support custom WhatsApp messages.
  whatsappMessage?: string;
}