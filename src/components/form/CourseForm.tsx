"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CreateCourseDto, UpdateCourseDto } from "@/types/course";

interface CourseFormProps {
  mode: "create" | "update";
  initialData?: Partial<CreateCourseDto | UpdateCourseDto>;
  onSubmit: (data: CreateCourseDto | UpdateCourseDto) => Promise<any>;
  onCancel: () => void;
}

export function CourseForm({ mode, initialData, onSubmit, onCancel }: CourseFormProps) {
  const [form, setForm] = useState<Partial<CreateCourseDto | UpdateCourseDto>>(initialData || {});
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof CreateCourseDto | keyof UpdateCourseDto, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "create") {
        await onSubmit(form as CreateCourseDto);
      } else {
        await onSubmit(form as UpdateCourseDto);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <Label>Title</Label>
        <Input
          value={form.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          required={mode === "create"}
        />
      </div>

      <div>
        <Label>Slug</Label>
        <Input
          value={form.slug || ""}
          onChange={(e) => handleChange("slug", e.target.value)}
          required={mode === "create"}
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={form.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <div>
        <Label>Price</Label>
        <Input
          type="number"
          value={form.price?.toString() || ""}
          onChange={(e) => handleChange("price", parseFloat(e.target.value))}
          required={mode === "create"}
        />
      </div>

      <div>
        <Label>Level</Label>
        <Select
          value={form.level || ""}
          onValueChange={(val) => handleChange("level", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BEGINNER">Beginner</SelectItem>
            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
            <SelectItem value="ADVANCED">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Category</Label>
        <Input
          value={form.category || ""}
          onChange={(e) => handleChange("category", e.target.value)}
        />
      </div>

      <div>
        <Label>Language</Label>
        <Input
          value={form.language || ""}
          onChange={(e) => handleChange("language", e.target.value)}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : mode === "create" ? "Create" : "Update"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
