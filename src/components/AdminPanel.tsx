import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Settings, Package, FolderOpen, Plus, Edit, Trash2, Eye, EyeOff, FileSpreadsheet } from 'lucide-react';
import { Product, Collection, StoreConfig } from '@/types/store';
import { ExcelImporter } from '@/components/ExcelImporter';

interface AdminPanelProps {
  storeConfig: StoreConfig;
  collections: Collection[];
  products: Product[];
  onUpdateStoreConfig: (config: StoreConfig) => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: number, product: Omit<Product, 'id'>) => void;
  onDeleteProduct: (id: number) => void;
  onToggleProductVisibility: (id: number) => void;
  onAddCollection: (collection: Omit<Collection, 'id'>) => void;
  onUpdateCollection: (id: number, collection: Omit<Collection, 'id'>) => void;
  onDeleteCollection: (id: number) => boolean;
}

export const AdminPanel = ({
  storeConfig,
  collections,
  products,
  onUpdateStoreConfig,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onToggleProductVisibility,
  onAddCollection,
  onUpdateCollection,
  onDeleteCollection
}: AdminPanelProps) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [showExcelImporter, setShowExcelImporter] = useState(false);

  const [productForm, setProductForm] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    description: '',
    age: '',
    skills: [],
    collection: '',
    image: '',
    visible: true,
    stock: 0
  });

  const [collectionForm, setCollectionForm] = useState<Omit<Collection, 'id'>>({
    name: '',
    description: ''
  });

  const [configForm, setConfigForm] = useState(storeConfig);

  const handleProductSubmit = () => {
    if (!productForm.name) {
      alert('El nombre del producto es obligatorio');
      return;
    }

    if (editingProduct) {
      onUpdateProduct(editingProduct.id, productForm);
    } else {
      onAddProduct(productForm);
    }

    resetProductForm();
  };

  const handleCollectionSubmit = () => {
    if (!collectionForm.name || !collectionForm.description) {
      alert('Por favor complete todos los campos');
      return;
    }

    if (editingCollection) {
      onUpdateCollection(editingCollection.id, collectionForm);
    } else {
      onAddCollection(collectionForm);
    }

    resetCollectionForm();
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: 0,
      description: '',
      age: '',
      skills: [],
      collection: '',
      image: '',
      visible: true,
      stock: 0
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const resetCollectionForm = () => {
    setCollectionForm({
      name: '',
      description: ''
    });
    setEditingCollection(null);
    setShowCollectionForm(false);
  };

  const editProduct = (product: Product) => {
    setProductForm({
      name: product.name,
      price: product.price,
      description: product.description,
      age: product.age,
      skills: product.skills,
      collection: product.collection,
      image: product.image,
      visible: product.visible,
      stock: product.stock || 0
    });
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const editCollection = (collection: Collection) => {
    setCollectionForm({
      name: collection.name,
      description: collection.description
    });
    setEditingCollection(collection);
    setShowCollectionForm(true);
  };

  const handleDeleteCollection = (id: number) => {
    const success = onDeleteCollection(id);
    if (!success) {
      const collection = collections.find(c => c.id === id);
      const productsInCollection = products.filter(p => p.collection === collection?.name);
      alert(`No se puede eliminar la colección "${collection?.name}" porque tiene ${productsInCollection.length} producto(s) asociado(s).`);
    }
  };

  const handleImportProducts = (importedProducts: Omit<Product, 'id'>[]) => {
    importedProducts.forEach(product => {
      onAddProduct(product);
    });
    setShowExcelImporter(false);
  };

  if (showExcelImporter) {
    return (
      <ExcelImporter
        collections={collections}
        onImportProducts={handleImportProducts}
        onClose={() => setShowExcelImporter(false)}
      />
    );
  }

  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-medium text-gray-900">
          <Settings className="w-5 h-5" />
          Panel de Administración
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-50">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Productos
            </TabsTrigger>
            <TabsTrigger value="collections" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Colecciones
            </TabsTrigger>
            <TabsTrigger value="store" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Gestión de Productos</h3>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowExcelImporter(true)} 
                  variant="outline"
                  className="border-gray-200"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Importar Excel
                </Button>
                <Button onClick={() => setShowProductForm(true)} className="bg-gray-900 hover:bg-gray-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Producto
                </Button>
              </div>
            </div>

            {showProductForm && (
              <Card className="p-6 border border-gray-200 bg-gray-50">
                <h4 className="font-medium mb-6 text-gray-900">
                  {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Nombre *</Label>
                    <Input
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="border-gray-200 focus:border-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Precio</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value) || 0})}
                      className="border-gray-200 focus:border-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Edad</Label>
                    <Input
                      value={productForm.age}
                      onChange={(e) => setProductForm({...productForm, age: e.target.value})}
                      placeholder="ej: 0-3 años, 3+, 6-12 meses"
                      className="border-gray-200 focus:border-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Stock disponible</Label>
                    <Input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({...productForm, stock: parseInt(e.target.value) || 0})}
                      className="border-gray-200 focus:border-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Colección</Label>
                    <Select value={productForm.collection} onValueChange={(value) => setProductForm({...productForm, collection: value})}>
                      <SelectTrigger className="border-gray-200 focus:border-gray-400">
                        <SelectValue placeholder="Seleccionar colección" />
                      </SelectTrigger>
                      <SelectContent>
                        {collections.map(collection => (
                          <SelectItem key={collection.id} value={collection.name}>
                            {collection.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">URL de Imagen</Label>
                    <Input
                      value={productForm.image}
                      onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="border-gray-200 focus:border-gray-400"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium text-gray-700">Habilidades (separadas por comas)</Label>
                    <Input
                      value={productForm.skills.join(', ')}
                      onChange={(e) => setProductForm({...productForm, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                      placeholder="Estimulación sensorial, Coordinación, Desarrollo cognitivo"
                      className="border-gray-200 focus:border-gray-400"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium text-gray-700">Descripción</Label>
                    <Textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      className="border-gray-200 focus:border-gray-400"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="visible"
                      checked={productForm.visible}
                      onCheckedChange={(checked) => setProductForm({...productForm, visible: checked as boolean})}
                    />
                    <Label htmlFor="visible" className="text-sm font-medium text-gray-700">Producto visible</Label>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button onClick={handleProductSubmit} className="bg-gray-900 hover:bg-gray-800">
                    Guardar
                  </Button>
                  <Button variant="outline" onClick={resetProductForm} className="border-gray-200">
                    Cancelar
                  </Button>
                </div>
              </Card>
            )}

            <div className="space-y-4">
              {products.map(product => (
                <Card key={product.id} className="p-4 border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-medium flex items-center gap-2 text-gray-900">
                        {product.name}
                        {!product.visible && <Badge variant="secondary" className="text-xs">Oculto</Badge>}
                        <Badge variant="outline" className="text-xs">
                          Stock: {product.stock || 0}
                        </Badge>
                      </h4>
                      <p className="text-sm text-gray-600">Precio: ${product.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Edad: {product.age}</p>
                      <p className="text-sm text-gray-600">Colección: {product.collection}</p>
                      {product.skills.length > 0 && (
                        <p className="text-sm text-gray-600">Habilidades: {product.skills.join(', ')}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => editProduct(product)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onToggleProductVisibility(product.id)}
                        className={product.visible ? "text-orange-600" : "text-green-600"}
                      >
                        {product.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          if (confirm('¿Está seguro de que desea eliminar este producto?')) {
                            onDeleteProduct(product.id);
                          }
                        }}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="collections" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Gestión de Colecciones</h3>
              <Button onClick={() => setShowCollectionForm(true)} className="bg-gray-900 hover:bg-gray-800">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Colección
              </Button>
            </div>

            {showCollectionForm && (
              <Card className="p-6 border border-gray-200 bg-gray-50">
                <h4 className="font-medium mb-6 text-gray-900">
                  {editingCollection ? 'Editar Colección' : 'Agregar Colección'}
                </h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Nombre</Label>
                    <Input
                      value={collectionForm.name}
                      onChange={(e) => setCollectionForm({...collectionForm, name: e.target.value})}
                      className="border-gray-200 focus:border-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Descripción</Label>
                    <Textarea
                      value={collectionForm.description}
                      onChange={(e) => setCollectionForm({...collectionForm, description: e.target.value})}
                      className="border-gray-200 focus:border-gray-400"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button onClick={handleCollectionSubmit} className="bg-gray-900 hover:bg-gray-800">
                    Guardar
                  </Button>
                  <Button variant="outline" onClick={resetCollectionForm} className="border-gray-200">
                    Cancelar
                  </Button>
                </div>
              </Card>
            )}

            <div className="space-y-4">
              {collections.map(collection => (
                <Card key={collection.id} className="p-4 border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{collection.name}</h4>
                      <p className="text-sm text-gray-600 mt-2">{collection.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => editCollection(collection)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          if (confirm('¿Está seguro de que desea eliminar esta colección?')) {
                            handleDeleteCollection(collection.id);
                          }
                        }}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="store" className="space-y-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900">Configuración de la Tienda</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Nombre de la Tienda</Label>
                  <Input
                    value={configForm.name}
                    onChange={(e) => setConfigForm({...configForm, name: e.target.value})}
                    className="border-gray-200 focus:border-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Teléfono WhatsApp</Label>
                  <Input
                    value={configForm.whatsApp}
                    onChange={(e) => setConfigForm({...configForm, whatsApp: e.target.value})}
                    placeholder="+5352497432"
                    className="border-gray-200 focus:border-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <Input
                    type="email"
                    value={configForm.email}
                    onChange={(e) => setConfigForm({...configForm, email: e.target.value})}
                    className="border-gray-200 focus:border-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Dirección</Label>
                  <Input
                    value={configForm.address}
                    onChange={(e) => setConfigForm({...configForm, address: e.target.value})}
                    className="border-gray-200 focus:border-gray-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Descripción</Label>
                <Input
                  value={configForm.description}
                  onChange={(e) => setConfigForm({...configForm, description: e.target.value})}
                  className="border-gray-200 focus:border-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Métodos de Pago (separados por comas)</Label>
                <Input
                  value={configForm.paymentMethods.join(', ')}
                  onChange={(e) => setConfigForm({...configForm, paymentMethods: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                  placeholder="Efectivo, Transferencia, Tarjeta"
                  className="border-gray-200 focus:border-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Zonas de Delivery (separadas por comas)</Label>
                <Input
                  value={configForm.deliveryZones.join(', ')}
                  onChange={(e) => setConfigForm({...configForm, deliveryZones: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                  placeholder="Centro, Norte, Sur"
                  className="border-gray-200 focus:border-gray-400"
                />
              </div>
              <Button 
                onClick={() => {
                  onUpdateStoreConfig(configForm);
                  alert('Configuración guardada exitosamente');
                }}
                className="bg-gray-900 hover:bg-gray-800"
              >
                Guardar Configuración
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
