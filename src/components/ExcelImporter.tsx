import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, FileSpreadsheet, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Product, Collection } from '@/types/store';

interface ExcelImporterProps {
  collections: Collection[];
  onImportProducts: (products: Omit<Product, 'id'>[]) => void;
  onAddCollection: (collection: Omit<Collection, 'id'>) => void;
  onClose: () => void;
}

interface ImportResult {
  success: number;
  errors: string[];
  warnings: string[];
  newCollections: string[];
}

export const ExcelImporter = ({ collections, onImportProducts, onAddCollection, onClose }: ExcelImporterProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const downloadTemplate = () => {
    const templateData = [
      {
        'Nombre': 'Ejemplo: Bloques de Construcción',
        'Precio': 15000,
        'Descripción': 'Set de bloques coloridos para desarrollo motor',
        'Edad': '2-5 años',
        'Habilidades': 'Coordinación, Creatividad, Pensamiento espacial',
        'Colección': '0-3 años',
        'Imagen URL': 'https://ejemplo.com/imagen.jpg',
        'Stock': 10,
        'Visible': 'SI'
      },
      {
        'Nombre': 'Rompecabezas Educativo',
        'Precio': 12000,
        'Descripción': 'Rompecabezas con piezas grandes',
        'Edad': '3-6 años',
        'Habilidades': 'Pensamiento lógico, Paciencia',
        'Colección': '3-6 años',
        'Imagen URL': '',
        'Stock': 5,
        'Visible': 'SI'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
    XLSX.writeFile(wb, 'inventario_tienda.xlsx');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseExcelFile(selectedFile);
    }
  };

  const parseExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log('Datos del Excel:', jsonData);
        setPreviewData(jsonData.slice(0, 10));
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Error al leer el archivo Excel. Verifique que el formato sea correcto.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const createCollectionIfNeeded = (collectionName: string, existingCollections: Collection[]): Omit<Collection, 'id'> | null => {
    if (!collectionName || collectionName.trim() === '') return null;
    
    const exists = existingCollections.some(c => c.name.toLowerCase() === collectionName.toLowerCase());
    if (exists) return null;

    return {
      name: collectionName.trim(),
      description: `Colección ${collectionName.trim()} - Importada desde Excel`
    };
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const validateAndProcessProduct = (row: any, index: number, availableCollections: Collection[]): { 
    product: Omit<Product, 'id'> | null; 
    errors: string[]; 
    warnings: string[];
    newCollection: Omit<Collection, 'id'> | null;
  } => {
    const errors: string[] = [];
    const warnings: string[] = [];
    let newCollection: Omit<Collection, 'id'> | null = null;

    // Validar nombre (único campo obligatorio)
    if (!row['Nombre'] || typeof row['Nombre'] !== 'string' || row['Nombre'].trim() === '') {
      errors.push(`Fila ${index + 2}: El nombre del producto es obligatorio`);
      return { product: null, errors, warnings, newCollection };
    }

    // Procesar campos con valores por defecto
    const name = String(row['Nombre']).trim();
    const price = row['Precio'] ? Number(row['Precio']) : 0;
    const description = row['Descripción'] ? String(row['Descripción']).trim() : '';
    const age = row['Edad'] ? String(row['Edad']).trim() : 'Todas las edades';
    const stock = row['Stock'] ? Math.max(0, Number(row['Stock'])) : 0;

    // Procesar habilidades
    let skills: string[] = [];
    if (row['Habilidades'] && typeof row['Habilidades'] === 'string') {
      skills = row['Habilidades'].split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
    }

    // Procesar colección
    let collectionName = availableCollections.length > 0 ? availableCollections[0].name : 'General';
    if (row['Colección'] && typeof row['Colección'] === 'string' && row['Colección'].trim() !== '') {
      const requestedCollection = row['Colección'].trim();
      const existingCollection = availableCollections.find(c => c.name.toLowerCase() === requestedCollection.toLowerCase());
      
      if (existingCollection) {
        collectionName = existingCollection.name;
      } else {
        // Crear nueva colección
        newCollection = createCollectionIfNeeded(requestedCollection, availableCollections);
        if (newCollection) {
          collectionName = newCollection.name;
          warnings.push(`Fila ${index + 2}: Se creará la nueva colección "${requestedCollection}"`);
        }
      }
    }

    // Procesar imagen - Mejorada la validación de URL
    let imageUrl = '';
    if (row['Imagen URL']) {
      const rawUrl = String(row['Imagen URL']).trim();
      console.log(`Procesando URL de imagen para ${name}:`, rawUrl);
      
      if (rawUrl !== '' && rawUrl !== 'undefined' && rawUrl !== 'null') {
        // Verificar si es una URL válida
        if (isValidUrl(rawUrl)) {
          imageUrl = rawUrl;
          console.log(`URL válida asignada para ${name}:`, imageUrl);
        } else {
          // Intentar agregar https:// si no tiene protocolo
          const urlWithProtocol = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
          if (isValidUrl(urlWithProtocol)) {
            imageUrl = urlWithProtocol;
            console.log(`URL con protocolo asignada para ${name}:`, imageUrl);
          } else {
            warnings.push(`Fila ${index + 2}: URL de imagen inválida "${rawUrl}", se ignorará`);
            console.log(`URL inválida para ${name}:`, rawUrl);
          }
        }
      }
    }

    // Procesar visibilidad
    let visible = true;
    if (row['Visible'] && typeof row['Visible'] === 'string') {
      const visibleStr = String(row['Visible']).toLowerCase().trim();
      visible = visibleStr === 'si' || visibleStr === 'sí' || visibleStr === 'yes' || visibleStr === 'true' || visibleStr === '1';
    }

    const product: Omit<Product, 'id'> = {
      name,
      price: Math.max(0, price),
      description,
      age,
      skills,
      collection: collectionName,
      image: imageUrl,
      visible,
      stock: Math.max(0, stock)
    };

    console.log(`Producto procesado: ${name}, imagen: "${imageUrl}"`);

    return { product, errors, warnings, newCollection };
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setProgress(0);
    setImportResult(null);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const validProducts: Omit<Product, 'id'>[] = [];
          const newCollections: Omit<Collection, 'id'>[] = [];
          const allErrors: string[] = [];
          const allWarnings: string[] = [];
          const newCollectionNames: string[] = [];

          let currentCollections = [...collections];

          jsonData.forEach((row, index) => {
            setProgress(((index + 1) / jsonData.length) * 100);
            
            const { product, errors, warnings, newCollection } = validateAndProcessProduct(row, index, currentCollections);
            
            allErrors.push(...errors);
            allWarnings.push(...warnings);
            
            // Agregar nueva colección si es necesaria
            if (newCollection) {
              const existingNew = newCollections.find(c => c.name.toLowerCase() === newCollection.name.toLowerCase());
              if (!existingNew) {
                newCollections.push(newCollection);
                newCollectionNames.push(newCollection.name);
                currentCollections.push({ ...newCollection, id: Date.now() + Math.random() });
              }
            }
            
            if (product) {
              validProducts.push(product);
            }
          });

          // Crear las nuevas colecciones primero
          newCollections.forEach(collection => {
            onAddCollection(collection);
          });

          // Luego importar los productos
          if (validProducts.length > 0) {
            onImportProducts(validProducts);
            console.log('Productos importados con URLs de imagen:', validProducts.map(p => ({ name: p.name, image: p.image })));
          }

          setImportResult({
            success: validProducts.length,
            errors: allErrors,
            warnings: allWarnings,
            newCollections: newCollectionNames
          });

          console.log(`Importación completada: ${validProducts.length} productos, ${newCollections.length} colecciones nuevas`);
        } catch (error) {
          console.error('Error processing Excel file:', error);
          setImportResult({
            success: 0,
            errors: ['Error al procesar el archivo Excel: ' + (error as Error).message],
            warnings: [],
            newCollections: []
          });
        } finally {
          setImporting(false);
          setProgress(100);
        }
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      setImporting(false);
      console.error('Import error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-yellow-600" />
            </div>
            Importar Inventario desde Excel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              onClick={downloadTemplate}
              variant="outline"
              className="h-12 border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all duration-200"
            >
              <Download className="w-5 h-5 mr-2 text-gray-600" />
              Descargar Plantilla Excel
            </Button>
            
            <div className="space-y-2">
              <Label htmlFor="excel-file" className="text-sm font-medium text-gray-700">
                Seleccionar archivo Excel
              </Label>
              <Input
                id="excel-file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="h-12 border-2 border-gray-200 focus:border-yellow-400 transition-colors duration-200"
              />
            </div>
          </div>

          {previewData.length > 0 && !importing && !importResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-900">Vista previa del archivo</h4>
                <span className="text-sm text-gray-500">({previewData.length} productos mostrados)</span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {Object.keys(previewData[0] || {}).map(key => (
                        <th key={key} className="text-left p-3 font-semibold text-gray-700 bg-white">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-white transition-colors">
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex} className="p-3 text-gray-700">
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleImport}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-3 transition-all duration-200"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Importar a la Tienda
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="border-2 border-gray-200 hover:border-gray-300 px-6 py-3"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {importing && (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-yellow-200 border-t-yellow-500 rounded-full animate-spin"></div>
                <span className="text-lg font-medium text-gray-700">Procesando archivo...</span>
              </div>
              <div className="space-y-2">
                <Progress value={progress} className="w-full h-3" />
                <span className="text-sm text-gray-500">{Math.round(progress)}% completado</span>
              </div>
            </div>
          )}

          {importResult && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="text-lg font-semibold text-gray-900">Importación Completada</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-700">{importResult.success}</div>
                  <div className="text-sm text-green-600 font-medium">Productos Importados</div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-700">{importResult.newCollections.length}</div>
                  <div className="text-sm text-blue-600 font-medium">Colecciones Nuevas</div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-red-700">{importResult.errors.length}</div>
                  <div className="text-sm text-red-600 font-medium">Errores</div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-700">{importResult.warnings.length}</div>
                  <div className="text-sm text-yellow-600 font-medium">Advertencias</div>
                </div>
              </div>

              {importResult.newCollections.length > 0 && (
                <Alert className="border-blue-200 bg-blue-50">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <div className="font-medium mb-2 text-blue-800">Nuevas colecciones creadas:</div>
                    <ul className="list-disc pl-4 space-y-1 text-sm text-blue-700">
                      {importResult.newCollections.map((collection, index) => (
                        <li key={index}>{collection}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {importResult.errors.length > 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription>
                    <div className="font-medium mb-2 text-red-800">Errores encontrados:</div>
                    <ul className="list-disc pl-4 space-y-1 text-sm text-red-700">
                      {importResult.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {importResult.warnings.length > 0 && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>
                    <div className="font-medium mb-2 text-yellow-800">Advertencias:</div>
                    <ul className="list-disc pl-4 space-y-1 text-sm text-yellow-700">
                      {importResult.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={onClose} 
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-8 py-3"
                >
                  Finalizar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFile(null);
                    setPreviewData([]);
                    setImportResult(null);
                    setProgress(0);
                  }}
                  className="border-2 border-gray-200 hover:border-gray-300 px-6 py-3"
                >
                  Importar Otro Archivo
                </Button>
              </div>
            </div>
          )}

          <Alert className="border-gray-200 bg-gray-50">
            <AlertTriangle className="h-4 w-4 text-gray-600" />
            <AlertDescription>
              <div className="font-medium mb-2 text-gray-800">Información importante:</div>
              <ul className="list-disc pl-4 space-y-1 text-sm text-gray-700">
                <li><strong>Solo el nombre es obligatorio</strong> - todos los demás campos son opcionales</li>
                <li>Las colecciones que no existan se crearán automáticamente</li>
                <li>Los productos se actualizarán en tiempo real en la tienda</li>
                <li>Usa la plantilla para ver el formato correcto</li>
                <li><strong>Las URLs de imagen deben ser válidas y accesibles</strong></li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
