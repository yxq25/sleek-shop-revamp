
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
        setPreviewData(jsonData.slice(0, 5)); // Solo mostrar las primeras 5 filas como preview
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

    // Validar campos obligatorios
    if (!row['Nombre'] || typeof row['Nombre'] !== 'string') {
      errors.push(`Fila ${index + 2}: Nombre es obligatorio y debe ser texto`);
    }
    
    if (!row['Precio'] || isNaN(Number(row['Precio']))) {
      errors.push(`Fila ${index + 2}: Precio es obligatorio y debe ser numérico`);
    }

    if (!row['Descripción'] || typeof row['Descripción'] !== 'string') {
      errors.push(`Fila ${index + 2}: Descripción es obligatoria`);
    }

    if (!row['Edad'] || typeof row['Edad'] !== 'string') {
      errors.push(`Fila ${index + 2}: Edad es obligatoria`);
    }

    if (!row['Colección'] || typeof row['Colección'] !== 'string') {
      errors.push(`Fila ${index + 2}: Colección es obligatoria`);
    }

    // Validar que la colección exista
    const collectionExists = collections.some(c => c.name === row['Colección']);
    if (row['Colección'] && !collectionExists) {
      errors.push(`Fila ${index + 2}: La colección "${row['Colección']}" no existe`);
    }

    // Procesar habilidades
    let skills: string[] = [];
    if (row['Habilidades']) {
      if (typeof row['Habilidades'] === 'string') {
        skills = row['Habilidades'].split(',').map((s: string) => s.trim()).filter((s: string) => s);
      } else {
        warnings.push(`Fila ${index + 2}: Las habilidades deben ser texto separado por comas`);
      }
    }

    // Validar URL de imagen (opcional pero si está presente debe ser válida)
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
      price: Number(row['Precio']),
      description: String(row['Descripción']).trim(),
      age: String(row['Edad']).trim(),
      skills,
      collection: String(row['Colección']).trim(),
      image: imageUrl,
      visible
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
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5" />
          Importar Productos desde Excel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Botón para descargar plantilla */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={downloadTemplate}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Descargar Plantilla Excel
          </Button>
          
          <div className="flex-1">
            <Label htmlFor="excel-file">Seleccionar archivo Excel</Label>
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="mt-1"
            />
          </div>
        </div>

        {/* Preview de datos */}
        {previewData.length > 0 && !importing && !importResult && (
          <div className="space-y-4">
            <h4 className="font-semibold">Vista previa (primeras 5 filas):</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    {Object.keys(previewData[0]).map(key => (
                      <th key={key} className="border border-gray-300 px-2 py-1 text-left text-sm font-medium">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, cellIndex) => (
                        <td key={cellIndex} className="border border-gray-300 px-2 py-1 text-sm">
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
                className="bg-green-600 hover:bg-green-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Importar Productos
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Progreso de importación */}
        {importing && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Procesando...</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Resultados de importación */}
        {importResult && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold">Importación completada</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{importResult.success}</div>
                  <div className="text-sm text-green-700">Productos importados</div>
                </div>
              </Card>
              
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{importResult.errors.length}</div>
                  <div className="text-sm text-red-700">Errores</div>
                </div>
              </Card>
              
              <Card className="p-4 border-yellow-200 bg-yellow-50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{importResult.warnings.length}</div>
                  <div className="text-sm text-yellow-700">Advertencias</div>
                </div>
              </Card>
            </div>

            {/* Mostrar errores */}
            {importResult.errors.length > 0 && (
              <Alert className="border-red-200">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold mb-2">Errores encontrados:</div>
                  <ul className="list-disc pl-4 space-y-1">
                    {importResult.errors.map((error, index) => (
                      <li key={index} className="text-sm">{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Mostrar advertencias */}
            {importResult.warnings.length > 0 && (
              <Alert className="border-yellow-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold mb-2">Advertencias:</div>
                  <ul className="list-disc pl-4 space-y-1">
                    {importResult.warnings.map((warning, index) => (
                      <li key={index} className="text-sm">{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
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
              >
                Importar Otro Archivo
              </Button>
            </div>
          </div>
        )}

        {/* Información sobre el formato */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-2">Formato requerido:</div>
            <ul className="list-disc pl-4 space-y-1 text-sm">
              <li><strong>Nombre:</strong> Texto obligatorio</li>
              <li><strong>Precio:</strong> Número obligatorio</li>
              <li><strong>Descripción:</strong> Texto obligatorio</li>
              <li><strong>Edad:</strong> Texto obligatorio (ej: "0-3 años", "3+")</li>
              <li><strong>Habilidades:</strong> Texto separado por comas</li>
              <li><strong>Colección:</strong> Debe coincidir con una colección existente</li>
              <li><strong>Imagen URL:</strong> URL válida (opcional)</li>
              <li><strong>Visible:</strong> "SI" o "NO" (opcional, por defecto "SI")</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
