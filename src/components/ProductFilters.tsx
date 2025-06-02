
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Collection, Product } from '@/types/store';

interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  collectionFilter: string;
  setCollectionFilter: (collection: string) => void;
  ageFilter: string;
  setAgeFilter: (age: string) => void;
  skillFilter: string;
  setSkillFilter: (skill: string) => void;
  collections: Collection[];
  products: Product[];
}

export const ProductFilters = ({
  searchTerm,
  setSearchTerm,
  collectionFilter,
  setCollectionFilter,
  ageFilter,
  setAgeFilter,
  skillFilter,
  setSkillFilter,
  collections,
  products
}: ProductFiltersProps) => {
  const uniqueAges = [...new Set(products.map(p => p.age))];
  const uniqueSkills = [...new Set(products.flatMap(p => p.skills))];

  return (
    <Card className="google-card google-font">
      <CardContent className="p-6">
        {/* Barra de búsqueda estilo Google */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar juguetes educativos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="google-search pl-12 text-base"
            />
          </div>
        </div>

        {/* Filtros en grid estilo Google */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="collection-filter" className="text-sm font-medium text-gray-700">
              Colección
            </Label>
            <Select value={collectionFilter} onValueChange={setCollectionFilter}>
              <SelectTrigger className="w-full border-gray-300 focus:border-google-blue focus:ring-google-blue">
                <SelectValue placeholder="Todas las colecciones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las colecciones</SelectItem>
                {collections.map(collection => (
                  <SelectItem key={collection.id} value={collection.name}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="age-filter" className="text-sm font-medium text-gray-700">
              Edad
            </Label>
            <Select value={ageFilter} onValueChange={setAgeFilter}>
              <SelectTrigger className="w-full border-gray-300 focus:border-google-blue focus:ring-google-blue">
                <SelectValue placeholder="Todas las edades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las edades</SelectItem>
                {uniqueAges.map(age => (
                  <SelectItem key={age} value={age}>
                    {age}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill-filter" className="text-sm font-medium text-gray-700">
              Habilidad
            </Label>
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger className="w-full border-gray-300 focus:border-google-blue focus:ring-google-blue">
                <SelectValue placeholder="Todas las habilidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las habilidades</SelectItem>
                {uniqueSkills.map(skill => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
