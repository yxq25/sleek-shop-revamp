
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
    <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="🔍 Buscar productos por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Colección</Label>
              <Select value={collectionFilter} onValueChange={setCollectionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {collections.map(collection => (
                    <SelectItem key={collection.id} value={collection.name}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Edad</Label>
              <Select value={ageFilter} onValueChange={setAgeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {uniqueAges.map(age => (
                    <SelectItem key={age} value={age}>
                      {age}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Habilidad</Label>
              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {uniqueSkills.map(skill => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
