"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateNoteAtTimeProps {
  currentTime: number;
  onSave: (note: { time: number; text: string }) => void;
}

export function CreateNoteAtTime({ currentTime, onSave }: CreateNoteAtTimeProps) {
  const [noteText, setNoteText] = useState("");

  const handleSave = () => {
    if (!noteText.trim()) return;
    onSave({ time: currentTime, text: noteText });
    setNoteText("");
  };

  return (
    <div className="space-y-2">
      <Input
        type="text"
        placeholder={`Note at ${currentTime.toFixed(1)}s`}
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
      />
      <Button onClick={handleSave} className="w-full">
        Save Note
      </Button>
    </div>
  );
}