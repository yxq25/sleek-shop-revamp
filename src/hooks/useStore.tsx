
import { useState } from 'react';
import { Product, Collection, StoreConfig } from '@/types/store';

const initialStoreConfig: StoreConfig = {
  name: "Tienda de Juguetes Didácticos",
  description: "Desarrollando mentes brillantes, un juguete a la vez",
  whatsApp: "+5352497432",
  email: "contacto@tiendajuguetes.com",
  address: "Calle Principal #123, Ciudad",
  paymentMethods: ["Efectivo", "Transferencia", "Tarjeta"],
  deliveryZones: ["Centro", "Norte", "Sur", "Este", "Oeste"]
};

const initialCollections: Collection[] = [
  {
    id: 1,
    name: "0-3 años",
    description: "Manos, ojos y asombro. Los primeros años son pura exploración: tocar, mirar y sorprenderse con cada descubrimiento. Esta colección acompaña ese proceso con juguetes que estimulan los sentidos, fortalecen habilidades y convierten el juego en aprendizaje."
  },
  {
    id: 2,
    name: "3-6 años",
    description: "Imaginación y creatividad en pleno desarrollo. Juguetes que estimulan la fantasía y el pensamiento creativo."
  },
  {
    id: 3,
    name: "6+ años",
    description: "Desafíos y aprendizaje avanzado. Juguetes que desarrollan habilidades complejas y pensamiento lógico."
  }
];

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'BABY GYM "Explora y crece"',
    price: 16000.00,
    description: "Gimnasio para bebés con múltiples actividades sensoriales y juguetes colgantes que estimulan el desarrollo motor y visual.",
    age: "0+",
    skills: ["Estimulación sensorial durante la primera infancia", "Coordinación ojo-mano", "Desarrollo motor"],
    collection: "0-3 años",
    image: "",
    visible: true
  },
  {
    id: 2,
    name: "Bloques Apilables Coloridos",
    price: 8500.00,
    description: "Set de bloques de madera natural en diferentes formas y colores para desarrollar la creatividad y coordinación.",
    age: "1-3 años",
    skills: ["Reconocimiento de formas", "Coordinación", "Pensamiento espacial"],
    collection: "0-3 años",
    image: "",
    visible: true
  },
  {
    id: 3,
    name: "Rompecabezas Educativo",
    price: 12000.00,
    description: "Rompecabezas de madera con piezas grandes, perfecto para desarrollar la paciencia y el pensamiento lógico.",
    age: "3-6 años",
    skills: ["Pensamiento lógico", "Paciencia", "Resolución de problemas"],
    collection: "3-6 años",
    image: "",
    visible: true
  }
];

export const useStore = () => {
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(initialStoreConfig);
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateStoreConfig = (newConfig: StoreConfig) => {
    setStoreConfig(newConfig);
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    setProducts([...products, { ...product, id: newId }]);
  };

  const updateProduct = (id: number, product: Omit<Product, 'id'>) => {
    setProducts(products.map(p => p.id === id ? { ...product, id } : p));
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const toggleProductVisibility = (id: number) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, visible: !p.visible } : p
    ));
  };

  const addCollection = (collection: Omit<Collection, 'id'>) => {
    const newId = Math.max(...collections.map(c => c.id), 0) + 1;
    setCollections([...collections, { ...collection, id: newId }]);
  };

  const updateCollection = (id: number, collection: Omit<Collection, 'id'>) => {
    const oldCollection = collections.find(c => c.id === id);
    if (oldCollection) {
      // Update products that use this collection
      setProducts(products.map(p => 
        p.collection === oldCollection.name ? { ...p, collection: collection.name } : p
      ));
    }
    setCollections(collections.map(c => c.id === id ? { ...collection, id } : c));
  };

  const deleteCollection = (id: number) => {
    const collection = collections.find(c => c.id === id);
    if (collection) {
      const productsInCollection = products.filter(p => p.collection === collection.name);
      if (productsInCollection.length === 0) {
        setCollections(collections.filter(c => c.id !== id));
        return true;
      }
    }
    return false;
  };

  return {
    storeConfig,
    collections,
    products,
    updateStoreConfig,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductVisibility,
    addCollection,
    updateCollection,
    deleteCollection
  };
};
