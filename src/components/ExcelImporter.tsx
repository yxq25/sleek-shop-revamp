
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
  onClose: () => void;
}

interface ImportResult {
  success: number;
  errors: string[];
  warnings: string[];
}

export const ExcelImporter = ({ collections, onImportProducts, onClose }: ExcelImporterProps) => {
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
        'Colección': collections[0]?.name || '0-3 años',
        'Imagen URL': 'https://ejemplo.com/imagen.jpg',
        'Stock': 10,
        'Visible': 'SI'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    XLSX.writeFile(wb, 'plantilla_productos.xlsx');
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
        setPreviewData(jsonData.slice(0, 5));
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Error al leer el archivo Excel. Verifique que el formato sea correcto.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const validateProduct = (row: any, index: number): { product: Omit<Product, 'id'> | null; errors: string[]; warnings: string[] } => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Solo validar nombre como obligatorio
    if (!row['Nombre'] || typeof row['Nombre'] !== 'string') {
      errors.push(`Fila ${index + 2}: Nombre es obligatorio`);
    }

    // Valores por defecto para campos opcionales
    const price = row['Precio'] ? Number(row['Precio']) : 0;
    const description = row['Descripción'] ? String(row['Descripción']).trim() : '';
    const age = row['Edad'] ? String(row['Edad']).trim() : '';
    const stock = row['Stock'] ? Number(row['Stock']) : 0;

    // Procesar habilidades
    let skills: string[] = [];
    if (row['Habilidades']) {
      if (typeof row['Habilidades'] === 'string') {
        skills = row['Habilidades'].split(',').map((s: string) => s.trim()).filter((s: string) => s);
      }
    }

    // Validar que la colección exista o usar la primera disponible
    let collection = collections[0]?.name || '';
    if (row['Colección']) {
      const collectionExists = collections.some(c => c.name === row['Colección']);
      if (collectionExists) {
        collection = row['Colección'];
      } else {
        warnings.push(`Fila ${index + 2}: La colección "${row['Colección']}" no existe, se usará "${collection}"`);
      }
    }

    // Procesar URL de imagen
    let imageUrl = '';
    if (row['Imagen URL']) {
      try {
        new URL(row['Imagen URL']);
        imageUrl = row['Imagen URL'];
      } catch {
        warnings.push(`Fila ${index + 2}: URL de imagen inválida, se ignorará`);
      }
    }

    // Procesar visibilidad
    let visible = true;
    if (row['Visible']) {
      const visibleStr = String(row['Visible']).toLowerCase();
      visible = visibleStr === 'si' || visibleStr === 'sí' || visibleStr === 'yes' || visibleStr === 'true' || visibleStr === '1';
    }

    if (errors.length > 0) {
      return { product: null, errors, warnings };
    }

    const product: Omit<Product, 'id'> = {
      name: String(row['Nombre']).trim(),
      price,
      description,
      age,
      skills,
      collection,
      image: imageUrl,
      visible,
      stock
    };

    return { product, errors, warnings };
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
          const allErrors: string[] = [];
          const allWarnings: string[] = [];

          jsonData.forEach((row, index) => {
            setProgress((index / jsonData.length) * 100);
            
            const { product, errors, warnings } = validateProduct(row, index);
            
            allErrors.push(...errors);
            allWarnings.push(...warnings);
            
            if (product) {
              validProducts.push(product);
            }
          });

          if (validProducts.length > 0) {
            onImportProducts(validProducts);
          }

          setImportResult({
            success: validProducts.length,
            errors: allErrors,
            warnings: allWarnings
          });

          setProgress(100);
        } catch (error) {
          console.error('Error processing Excel file:', error);
          setImportResult({
            success: 0,
            errors: ['Error al procesar el archivo Excel'],
            warnings: []
          });
        } finally {
          setImporting(false);
        }
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      setImporting(false);
      console.error('Import error:', error);
    }
  };

  return (
    <Card className="w-full max-w-4xl bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-medium">
          <FileSpreadsheet className="w-5 h-5" />
          Importar Productos desde Excel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={downloadTemplate}
            variant="outline"
            className="flex items-center gap-2 border-gray-200"
          >
            <Download className="w-4 h-4" />
            Descargar Plantilla
          </Button>
          
          <div className="flex-1">
            <Label htmlFor="excel-file" className="text-sm font-medium">Seleccionar archivo Excel</Label>
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="mt-1 border-gray-200"
            />
          </div>
        </div>

        {previewData.length > 0 && !importing && !importResult && (
          <div className="space-y-4">
            <h4 className="font-medium">Vista previa:</h4>
            <div className="overflow-x-auto bg-gray-50 rounded-lg p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    {Object.keys(previewData[0]).map(key => (
                      <th key={key} className="text-left p-2 font-medium text-gray-700">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      {Object.values(row).map((value, cellIndex) => (
                        <td key={cellIndex} className="p-2 text-gray-600">
                          {String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleImport}
                disabled={importing}
                className="bg-gray-900 hover:bg-gray-800"
              >
                <Upload className="w-4 h-4 mr-2" />
                Importar Productos
              </Button>
              <Button variant="outline" onClick={onClose} className="border-gray-200">
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {importing && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Procesando...</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {importResult && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium">Importación completada</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{importResult.success}</div>
                <div className="text-sm text-green-700">Productos importados</div>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">{importResult.errors.length}</div>
                <div className="text-sm text-red-700">Errores</div>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">{importResult.warnings.length}</div>
                <div className="text-sm text-yellow-700">Advertencias</div>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">Errores:</div>
                  <ul className="list-disc pl-4 space-y-1 text-sm">
                    {importResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {importResult.warnings.length > 0 && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">Advertencias:</div>
                  <ul className="list-disc pl-4 space-y-1 text-sm">
                    {importResult.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button onClick={onClose} className="bg-gray-900 hover:bg-gray-800">
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
                className="border-gray-200"
              >
                Importar Otro Archivo
              </Button>
            </div>
          </div>
        )}

        <Alert className="border-gray-200 bg-gray-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-2">Solo el nombre es obligatorio:</div>
            <ul className="list-disc pl-4 space-y-1 text-sm text-gray-600">
              <li><strong>Nombre:</strong> Texto obligatorio</li>
              <li><strong>Precio:</strong> Número (opcional, defecto: 0)</li>
              <li><strong>Descripción:</strong> Texto (opcional)</li>
              <li><strong>Edad:</strong> Texto (opcional)</li>
              <li><strong>Habilidades:</strong> Separadas por comas (opcional)</li>
              <li><strong>Colección:</strong> Debe existir (opcional, usa la primera si no coincide)</li>
              <li><strong>Stock:</strong> Número de unidades disponibles (opcional, defecto: 0)</li>
              <li><strong>Imagen URL:</strong> URL válida (opcional)</li>
              <li><strong>Visible:</strong> "SI" o "NO" (opcional, defecto: "SI")</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
