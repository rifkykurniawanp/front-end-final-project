"use client";
import React, { useState } from "react";
import { Filter, Search, X, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ProductCategory, ProductOrigin, ProductStatus, ProductTagName } from "@/types/enum";
import { FilterState } from "@/types/product";

interface FilterSidebarProps {
  filters: FilterState;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  updateFilter: (key: keyof FilterState, value: FilterState[keyof FilterState]) => void;
  resetFilters: () => void;
}

const getCategoryConfig = () => {
  const config: Record<string, { label: string; emoji: string }> = {};
  (Object.keys(ProductCategory) as Array<keyof typeof ProductCategory>).forEach((key) => {
    const category = ProductCategory[key];
    switch (category) {
      case ProductCategory.TEA:
        config[category] = { label: "Teh", emoji: "🍃" }; break;
      case ProductCategory.COFFEE:
        config[category] = { label: "Kopi", emoji: "☕" }; break;
      case ProductCategory.HERBAL:
        config[category] = { label: "Herbal", emoji: "🌿" }; break;
      case ProductCategory.EQUIPMENT:
        config[category] = { label: "Peralatan", emoji: "🔧" }; break;
      default:
        config[category] = { label: category, emoji: "📦" };
    }
  });
  return config;
};

const getOriginConfig = () => {
  const config: Record<string, { label: string; emoji: string }> = {};
  (Object.keys(ProductOrigin) as Array<keyof typeof ProductOrigin>).forEach((key) => {
    const origin = ProductOrigin[key];
    switch (origin) {
      case ProductOrigin.INDONESIA:
        config[origin] = { label: "Indonesia", emoji: "🇮🇩" }; break;
      case ProductOrigin.VIETNAM:
        config[origin] = { label: "Vietnam", emoji: "🇻🇳" }; break;
      case ProductOrigin.BRAZIL:
        config[origin] = { label: "Brazil", emoji: "🇧🇷" }; break;
      case ProductOrigin.ETHIOPIA:
        config[origin] = { label: "Ethiopia", emoji: "🇪🇹" }; break;
      case ProductOrigin.OTHER:
        config[origin] = { label: "Lainnya", emoji: "🌍" }; break;
      default:
        config[origin] = { label: origin, emoji: "🌍" };
    }
  });
  return config;
};

const getTagConfig = () => {
  const config: Record<string, { label: string; emoji: string }> = {};
  (Object.keys(ProductTagName) as Array<keyof typeof ProductTagName>).forEach((key) => {
    const tag = ProductTagName[key];
    switch (tag) {
      case ProductTagName.ARABICA: 
        config[tag] = { label: "Arabica", emoji: "☕" }; break;
      case ProductTagName.ROBUSTA: 
        config[tag] = { label: "Robusta", emoji: "☕" }; break;
      case ProductTagName.GREEN_TEA: 
        config[tag] = { label: "Teh Hijau", emoji: "🍵" }; break;
      case ProductTagName.HERBAL: 
        config[tag] = { label: "Herbal", emoji: "🌿" }; break;
      case ProductTagName.EQUIPMENT: 
        config[tag] = { label: "Peralatan", emoji: "🔧" }; break;
      default: 
        config[tag] = { label: (tag as string).replace(/_/g, ' '), emoji: "🏷️" };
    }
  });
  return config;
};

const getStatusConfig = () => {
  const config: Record<string, { label: string; emoji: string }> = {};
  (Object.keys(ProductStatus) as Array<keyof typeof ProductStatus>).forEach((key) => {
    const status = ProductStatus[key];
    switch (status) {
      case ProductStatus.ACTIVE: 
        config[status] = { label: "Aktif", emoji: "✅" }; break;
      case ProductStatus.OUT_OF_STOCK: 
        config[status] = { label: "Habis Stok", emoji: "📭" }; break;
      case ProductStatus.DRAFT: 
        config[status] = { label: "Draft", emoji: "📝" }; break;
      default: 
        config[status] = { label: (status as string).replace(/_/g, ' '), emoji: "📊" };
    }
  });
  return config;
};

const RATING_OPTIONS = [
  { value: 0, label: "Semua Rating", stars: "" },
  { value: 3, label: "3+ Bintang", stars: "⭐⭐⭐" },
  { value: 4, label: "4+ Bintang", stars: "⭐⭐⭐⭐" },
  { value: 4.5, label: "4.5+ Bintang", stars: "⭐⭐⭐⭐⭐" },
];

// Type guards for array filters
const isArrayFilter = (value: any): value is any[] => Array.isArray(value);
const getArrayFilterLength = (value: any): number => isArrayFilter(value) ? value.length : 0;

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  filters, 
  searchTerm, 
  setSearchTerm, 
  updateFilter, 
  resetFilters 
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const CATEGORY_CONFIG = getCategoryConfig();
  const ORIGIN_CONFIG = getOriginConfig();
  const TAG_CONFIG = getTagConfig();
  const STATUS_CONFIG = getStatusConfig();

  const formatCurrency = (value: number) =>
    value.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm?.trim()) count++;
    if (getArrayFilterLength(filters.category) > 0) count++;
    if (getArrayFilterLength(filters.origin) > 0) count++;
    if (getArrayFilterLength(filters.tags) > 0) count++;
    if (getArrayFilterLength(filters.status) > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500000) count++;
    if (filters.minRating > 0) count++;
    return count;
  };

  const handleClearSearch = () => setSearchTerm("");
  const handleResetWithClose = () => { resetFilters(); setIsSheetOpen(false); };

  const handleCheckboxChange = (
    filterKey: 'category' | 'origin' | 'tags' | 'status',
    value: string
  ) => {
    const currentArray = filters[filterKey] as any[] || [];
    const newArray = currentArray.includes(value) 
      ? currentArray.filter((i) => i !== value) 
      : [...currentArray, value];
    updateFilter(filterKey, newArray as any);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-3">
        <Label htmlFor="search" className="text-sm font-semibold text-gray-700">🔍 Cari Produk</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            id="search" 
            placeholder="Masukkan nama produk..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-10 pr-10 border-amber-200 focus:border-amber-400 focus:ring-amber-400" 
          />
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearSearch} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      <Separator className="bg-amber-100" />

      {/* Category Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-700">📁 Kategori</Label>
          {getArrayFilterLength(filters.category) > 0 && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              {getArrayFilterLength(filters.category)}
            </Badge>
          )}
        </div>
        <div className="grid gap-3">
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center space-x-3 p-2 rounded-md hover:bg-amber-50 transition-colors">
              <Checkbox
                id={`category-${key}`}
                checked={filters.category.includes(key as ProductCategory)}
                onCheckedChange={() => handleCheckboxChange('category', key)}
                className="border-amber-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
              />
              <Label htmlFor={`category-${key}`} className="flex items-center gap-2 cursor-pointer flex-1">
                <span>{config.emoji}</span>
                <span className="text-sm">{config.label}</span>
              </Label>
            </div>
          ))}
        </div>
      </div>
      <Separator className="bg-amber-100" />

      {/* Origin Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-700">🌍 Asal Produk</Label>
          {getArrayFilterLength(filters.origin) > 0 && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              {getArrayFilterLength(filters.origin)}
            </Badge>
          )}
        </div>
        <div className="grid gap-3">
          {Object.entries(ORIGIN_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center space-x-3 p-2 rounded-md hover:bg-amber-50 transition-colors">
              <Checkbox
                id={`origin-${key}`}
                checked={filters.origin.includes(key as ProductOrigin)}
                onCheckedChange={() => handleCheckboxChange('origin', key)}
                className="border-amber-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
              />
              <Label htmlFor={`origin-${key}`} className="flex items-center gap-2 cursor-pointer flex-1">
                <span>{config.emoji}</span>
                <span className="text-sm">{config.label}</span>
              </Label>
            </div>
          ))}
        </div>
      </div>
      <Separator className="bg-amber-100" />

      {/* Tags Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-700">🏷️ Label Produk</Label>
          {getArrayFilterLength(filters.tags) > 0 && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              {getArrayFilterLength(filters.tags)}
            </Badge>
          )}
        </div>
        <div className="grid gap-3">
          {Object.entries(TAG_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center space-x-3 p-2 rounded-md hover:bg-amber-50 transition-colors">
              <Checkbox
                id={`tags-${key}`}
                checked={filters.tags.includes(key as ProductTagName)}
                onCheckedChange={() => handleCheckboxChange('tags', key)}
                className="border-amber-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
              />
              <Label htmlFor={`tags-${key}`} className="flex items-center gap-2 cursor-pointer flex-1">
                <span>{config.emoji}</span>
                <span className="text-sm">{config.label}</span>
              </Label>
            </div>
          ))}
        </div>
      </div>
      <Separator className="bg-amber-100" />

      {/* Status Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-700">📊 Status Produk</Label>
          {getArrayFilterLength(filters.status) > 0 && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              {getArrayFilterLength(filters.status)}
            </Badge>
          )}
        </div>
        <div className="grid gap-3">
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center space-x-3 p-2 rounded-md hover:bg-amber-50 transition-colors">
              <Checkbox
                id={`status-${key}`}
                checked={filters.status.includes(key as ProductStatus)}
                onCheckedChange={() => handleCheckboxChange('status', key)}
                className="border-amber-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
              />
              <Label htmlFor={`status-${key}`} className="flex items-center gap-2 cursor-pointer flex-1">
                <span>{config.emoji}</span>
                <span className="text-sm">{config.label}</span>
              </Label>
            </div>
          ))}
        </div>
      </div>
      <Separator className="bg-amber-100" />

      {/* Price Range */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold text-gray-700">💰 Kisaran Harga</Label>
        <div className="px-2">
          <Slider 
            value={filters.priceRange} 
            onValueChange={(value) => updateFilter("priceRange", value as any)} 
            max={500000} 
            step={10000} 
            className="w-full" 
          />
          <div className="flex justify-between text-xs text-gray-600 mt-2 px-1">
            <span className="font-medium bg-amber-50 px-2 py-1 rounded">
              {formatCurrency(filters.priceRange[0])}
            </span>
            <span className="font-medium bg-amber-50 px-2 py-1 rounded">
              {formatCurrency(filters.priceRange[1])}
            </span>
          </div>
        </div>
      </div>
      <Separator className="bg-amber-100" />

      {/* Rating Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700">⭐ Rating Minimum</Label>
        <Select 
          value={filters.minRating.toString()} 
          onValueChange={(value) => updateFilter("minRating", Number(value) as any)}
        >
          <SelectTrigger className="border-amber-200 focus:border-amber-400 focus:ring-amber-400">
            <SelectValue placeholder="Pilih rating minimum" />
          </SelectTrigger>
          <SelectContent>
            {RATING_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                <div className="flex items-center gap-2">
                  <span>{option.label}</span>
                  {option.stars && <span className="text-xs">{option.stars}</span>}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset Button */}
      <Button 
        variant="outline" 
        onClick={handleResetWithClose} 
        className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 transition-colors mt-4" 
        disabled={getActiveFilterCount() === 0}
      >
        <RotateCcw className="mr-2 h-4 w-4" /> Reset Semua Filter
      </Button>
    </div>
  );

  return (
    <div className="mb-6">
      {/* Mobile View */}
      <div className="block lg:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full mb-4 border-amber-300 text-amber-700 hover:bg-amber-50 relative">
              <Filter className="mr-2 h-4 w-4" /> Filter Produk
              {getActiveFilterCount() > 0 && (
                <Badge className="ml-2 bg-amber-600 text-white text-xs px-1.5 py-0.5">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="overflow-auto w-80 sm:w-96">
            <SheetHeader className="pb-4">
              <SheetTitle className="text-lg font-semibold flex items-center gap-2 text-amber-700">
                <Filter className="w-5 h-5" /> Filter Produk
              </SheetTitle>
            </SheetHeader>
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <Card className="w-full border-amber-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-amber-700">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" /> Filter Produk
              </div>
              {getActiveFilterCount() > 0 && (
                <Badge className="bg-amber-600 text-white">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FilterContent />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};