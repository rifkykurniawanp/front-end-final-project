"use client";
import React, { useState } from "react";
import { Filter, Search } from "lucide-react";
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

import { FilterState } from "@/types/product";

interface FilterSidebarProps {
  filters: FilterState;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  searchTerm,
  setSearchTerm,
  updateFilter,
  resetFilters,
}) => {
  const categories = ["tea", "coffee", "herbal"];
  const subcategories = ["ingredient", "tool", "support"];

  const FilterForm = (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filter Produk
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div>
          <Label htmlFor="search">Cari Produk</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Kategori */}
        <div>
          <Label>Kategori</Label>
          <div className="space-y-2 mt-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={filters.category.includes(category)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFilter("category", [...filters.category, category]);
                    } else {
                      updateFilter("category", filters.category.filter((c) => c !== category));
                    }
                  }}
                />
                <Label htmlFor={category} className="capitalize">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Subkategori */}
        <div>
          <Label>Jenis</Label>
          <div className="space-y-2 mt-2">
            {subcategories.map((subcategory) => (
              <div key={subcategory} className="flex items-center space-x-2">
                <Checkbox
                  id={subcategory}
                  checked={filters.subcategory.includes(subcategory)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFilter("subcategory", [...filters.subcategory, subcategory]);
                    } else {
                      updateFilter("subcategory", filters.subcategory.filter((s) => s !== subcategory));
                    }
                  }}
                />
                <Label htmlFor={subcategory} className="capitalize">
                  {subcategory === "ingredient" ? "Bahan" : subcategory === "tool" ? "Alat" : "Penunjang"}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Harga */}
        <div>
          <Label>Kisaran Harga</Label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilter("priceRange", value as [number, number])}
            max={500000}
            step={10000}
            className="mt-2"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>
              {filters.priceRange[0].toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </span>
            <span>
              {filters.priceRange[1].toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </span>
          </div>
        </div>

        {/* Rating */}
        <div>
          <Label>Rating Minimum</Label>
          <Select
            value={filters.rating.toString()}
            onValueChange={(val) => updateFilter("rating", Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Semua Rating</SelectItem>
              <SelectItem value="4">4+ Bintang</SelectItem>
              <SelectItem value="4.5">4.5+ Bintang</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset */}
        <Button variant="outline" onClick={resetFilters} className="w-full">
          Reset Filter
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="mb-4">
      {/* Mobile View */}
      <div className="block md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full mb-2">
              <Filter className="mr-2 h-4 w-4" />
              Tampilkan Filter
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="overflow-auto w-80">
            <SheetHeader>
              <SheetTitle className="text-lg font-semibold flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter Produk
              </SheetTitle>
            </SheetHeader>

            <div className="mt-4">
              {FilterForm}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block w-full md:w-64">{FilterForm}</div>
    </div>
  );
};
