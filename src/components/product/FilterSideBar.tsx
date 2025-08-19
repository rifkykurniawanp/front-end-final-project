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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ProductCategory, ProductOrigin, ProductStatus, ProductTagName } from "@/types/enum";

// Updated FilterState to match your actual types
export interface FilterState {
  category: ProductCategory[];
  origin: ProductOrigin[];
  tags: ProductTagName[];
  priceRange: [number, number];
  status: ProductStatus[];
  minRating: number;
}

interface FilterSidebarProps {
  filters: FilterState;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
}

// Get all enum values dynamically
const getCategoryConfig = () => {
  const config: Record<string, { label: string; emoji: string }> = {};
  Object.values(ProductCategory).forEach((category) => {
    switch (category.toLowerCase()) {
      case 'tea':
        config[category] = { label: "Teh", emoji: "🍃" };
        break;
      case 'coffee':
        config[category] = { label: "Kopi", emoji: "☕" };
        break;
      case 'herbal':
        config[category] = { label: "Herbal", emoji: "🌿" };
        break;
      default:
        config[category] = { 
          label: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(), 
          emoji: "📦" 
        };
    }
  });
  return config;
};

const getOriginConfig = () => {
  const config: Record<string, { label: string; emoji: string }> = {};
  Object.values(ProductOrigin).forEach((origin) => {
    switch (origin.toLowerCase()) {
      case 'local':
      case 'lokal':
        config[origin] = { label: "Lokal", emoji: "🇮🇩" };
        break;
      case 'imported':
      case 'import':
        config[origin] = { label: "Impor", emoji: "🌍" };
        break;
      case 'organic':
      case 'organik':
        config[origin] = { label: "Organik", emoji: "🌱" };
        break;
      default:
        config[origin] = { 
          label: origin.charAt(0).toUpperCase() + origin.slice(1).toLowerCase(), 
          emoji: "🌍" 
        };
    }
  });
  return config;
};

const getTagConfig = () => {
  const config: Record<string, { label: string; emoji: string }> = {};
  Object.values(ProductTagName).forEach((tag) => {
    switch (tag.toLowerCase()) {
      case 'premium':
        config[tag] = { label: "Premium", emoji: "⭐" };
        break;
      case 'bestseller':
      case 'terlaris':
        config[tag] = { label: "Terlaris", emoji: "🔥" };
        break;
      case 'new':
      case 'baru':
        config[tag] = { label: "Baru", emoji: "✨" };
        break;
      case 'discount':
      case 'diskon':
        config[tag] = { label: "Diskon", emoji: "🏷️" };
        break;
      case 'popular':
      case 'populer':
        config[tag] = { label: "Populer", emoji: "👑" };
        break;
      default:
        config[tag] = { 
          label: tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase(), 
          emoji: "🏷️" 
        };
    }
  });
  return config;
};

const getStatusConfig = () => {
  const config: Record<string, { label: string; emoji: string }> = {};
  Object.values(ProductStatus).forEach((status) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'aktif':
        config[status] = { label: "Aktif", emoji: "✅" };
        break;
      case 'inactive':
      case 'nonaktif':
        config[status] = { label: "Nonaktif", emoji: "❌" };
        break;
      case 'out_of_stock':
      case 'habis':
        config[status] = { label: "Habis", emoji: "📭" };
        break;
      default:
        config[status] = { 
          label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(), 
          emoji: "📊" 
        };
    }
  });
  return config;
};

const RATING_OPTIONS = [
  { value: 0, label: "Semua Rating", stars: "" },
  { value: 3, label: "3+ Bintang", stars: "⭐⭐⭐" },
  { value: 4, label: "4+ Bintang", stars: "⭐⭐⭐⭐" },
  { value: 4.5, label: "4.5+ Bintang", stars: "⭐⭐⭐⭐⭐" }
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  searchTerm,
  setSearchTerm,
  updateFilter,
  resetFilters,
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Get dynamic configurations
  const CATEGORY_CONFIG = getCategoryConfig();
  const ORIGIN_CONFIG = getOriginConfig();
  const TAG_CONFIG = getTagConfig();
  const STATUS_CONFIG = getStatusConfig();

  const formatCurrency = (value: number) => {
    return value.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm?.trim()) count++;
    if (filters.category?.length > 0) count++;
    if (filters.origin?.length > 0) count++;
    if (filters.tags?.length > 0) count++;
    if (filters.status?.length > 0) count++;
    if (filters.priceRange?.[0] > 0 || filters.priceRange?.[1] < 500000) count++;
    if (filters.minRating > 0) count++;
    return count;
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleResetWithClose = () => {
    resetFilters();
    setIsSheetOpen(false);
  };

  const handleCheckboxChange = <T extends string>(
    filterKey: keyof FilterState,
    value: T,
    currentArray: T[] = []
  ) => {
    const safeArray = currentArray || [];
    const newArray = safeArray.includes(value)
      ? safeArray.filter((item) => item !== value)
      : [...safeArray, value];
    updateFilter(filterKey, newArray as FilterState[keyof FilterState]);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="space-y-3">
        <Label htmlFor="search" className="text-sm font-semibold text-gray-700">
          🔍 Cari Produk
        </Label>
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

      {/* Category Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-700">📁 Kategori</Label>
          {(filters.category?.length || 0) > 0 && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              {filters.category?.length || 0}
            </Badge>
          )}
        </div>
        <div className="grid gap-3">
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center space-x-3 p-2 rounded-md hover:bg-amber-50 transition-colors">
              <Checkbox
                id={`category-${key}`}
                checked={filters.category?.includes(key as ProductCategory) || false}
                onCheckedChange={() => handleCheckboxChange('category', key as ProductCategory, filters.category)}
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

      {/* Origin Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-700">🌍 Asal Produk</Label>
          {(filters.origin?.length || 0) > 0 && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              {filters.origin?.length || 0}
            </Badge>
          )}
        </div>
        <div className="grid gap-3">
          {Object.entries(ORIGIN_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center space-x-3 p-2 rounded-md hover:bg-amber-50 transition-colors">
              <Checkbox
                id={`origin-${key}`}
                checked={filters.origin?.includes(key as ProductOrigin) || false}
                onCheckedChange={() => handleCheckboxChange('origin', key as ProductOrigin, filters.origin)}
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

      {/* Tags Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-700">🏷️ Label Produk</Label>
          {(filters.tags?.length || 0) > 0 && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              {filters.tags?.length || 0}
            </Badge>
          )}
        </div>
        <div className="grid gap-3">
          {Object.entries(TAG_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center space-x-3 p-2 rounded-md hover:bg-amber-50 transition-colors">
              <Checkbox
                id={`tag-${key}`}
                checked={filters.tags?.includes(key as ProductTagName) || false}
                onCheckedChange={() => handleCheckboxChange('tags', key as ProductTagName, filters.tags)}
                className="border-amber-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
              />
              <Label htmlFor={`tag-${key}`} className="flex items-center gap-2 cursor-pointer flex-1">
                <span>{config.emoji}</span>
                <span className="text-sm">{config.label}</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-amber-100" />

      {/* Status Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-700">📊 Status Produk</Label>
          {(filters.status?.length || 0) > 0 && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              {filters.status?.length || 0}
            </Badge>
          )}
        </div>
        <div className="grid gap-3">
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center space-x-3 p-2 rounded-md hover:bg-amber-50 transition-colors">
              <Checkbox
                id={`status-${key}`}
                checked={filters.status?.includes(key as ProductStatus) || false}
                onCheckedChange={() => handleCheckboxChange('status', key as ProductStatus, filters.status)}
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

      {/* Price Range Section */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold text-gray-700">💰 Kisaran Harga</Label>
        <div className="px-2">
          <Slider
            value={filters.priceRange || [0, 500000]}
            onValueChange={(value) => updateFilter("priceRange", value as [number, number])}
            max={500000}
            step={10000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-2 px-1">
            <span className="font-medium bg-amber-50 px-2 py-1 rounded">
              {formatCurrency(filters.priceRange?.[0] || 0)}
            </span>
            <span className="font-medium bg-amber-50 px-2 py-1 rounded">
              {formatCurrency(filters.priceRange?.[1] || 500000)}
            </span>
          </div>
        </div>
      </div>

      <Separator className="bg-amber-100" />

      {/* Rating Section */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700">⭐ Rating Minimum</Label>
        <Select
          value={(filters.minRating || 0).toString()}
          onValueChange={(val) => updateFilter("minRating", Number(val))}
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

      {/* Active Filters Summary */}
      {getActiveFilterCount() > 0 && (
        <>
          <Separator className="bg-amber-100" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-gray-700">🏷️ Filter Aktif</Label>
              <Badge className="bg-amber-600 text-white">
                {getActiveFilterCount()}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchTerm?.trim() && (
                <Badge variant="outline" className="text-xs border-amber-300">
                  Pencarian: {searchTerm}
                </Badge>
              )}
              {filters.category?.map((cat) => (
                <Badge key={cat} variant="outline" className="text-xs border-amber-300">
                  {CATEGORY_CONFIG[cat]?.label || cat}
                </Badge>
              ))}
              {filters.origin?.map((origin) => (
                <Badge key={origin} variant="outline" className="text-xs border-amber-300">
                  {ORIGIN_CONFIG[origin]?.label || origin}
                </Badge>
              ))}
              {filters.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs border-amber-300">
                  {TAG_CONFIG[tag]?.label || tag}
                </Badge>
              ))}
              {filters.status?.map((status) => (
                <Badge key={status} variant="outline" className="text-xs border-amber-300">
                  {STATUS_CONFIG[status]?.label || status}
                </Badge>
              ))}
              {(filters.minRating || 0) > 0 && (
                <Badge variant="outline" className="text-xs border-amber-300">
                  Rating {filters.minRating}+
                </Badge>
              )}
            </div>
          </div>
        </>
      )}

      <Separator className="bg-amber-100" />

      {/* Reset Button */}
      <Button 
        variant="outline" 
        onClick={handleResetWithClose} 
        className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
        disabled={getActiveFilterCount() === 0}
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset Semua Filter
      </Button>
    </div>
  );

  return (
    <div className="mb-6">
      {/* Mobile View */}
      <div className="block lg:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full mb-4 border-amber-300 text-amber-700 hover:bg-amber-50 relative"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter Produk
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
                <Filter className="w-5 h-5" />
                Filter Produk
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
                <Filter className="w-5 h-5" />
                Filter Produk
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