
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  age: string;
  skills: string[];
  collection: string;
  image: string;
  visible: boolean;
  stock?: number; // Cantidad disponible
}

export interface Collection {
  id: number;
  name: string;
  description: string;
}

export interface StoreConfig {
  name: string;
  description: string;
  whatsApp: string;
  email: string;
  address: string;
  paymentMethods: string[];
  deliveryZones: string[];
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  preferredTime: string;
  comments: string;
}
