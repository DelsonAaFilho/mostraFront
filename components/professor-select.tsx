"use client";

import { GraduationCap } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PersonAvatar } from "@/components/person-avatar";
import { professors } from "@/lib/data";

export function ProfessorSelect({
  value,
  onChange,
  error,
  onBlur,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onBlur: () => void;
}) {
  const selected = professors.find((professor) => professor.id === value);
  return (
    <>
      <Select
        value={value || null}
        onValueChange={(value) => onChange(value ?? "")}
        items={professors.map((professor) => ({
          value: professor.id,
          label: professor.name,
        }))}
      >
        <SelectTrigger
          id="professorId"
          className="w-full"
          onBlur={onBlur}
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? "professorId-error" : undefined}
        >
          <SelectValue placeholder="Choose a registered professor" />
        </SelectTrigger>
        <SelectContent
          alignItemWithTrigger={false}
          className="professor-options"
        >
          {professors.map((professor) => (
            <SelectItem
              key={professor.id}
              value={professor.id}
              className="professor-option"
            >
              <PersonAvatar name={professor.name} image={professor.image} />
              <span className="professor-option-text">
                <strong>{professor.name}</strong>
                <span>{professor.email}</span>
                <small>{professor.department}</small>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selected ? (
        <div className="professor-summary">
          <PersonAvatar
            name={selected.name}
            image={selected.image}
            className="size-11"
          />
          <div>
            <strong>{selected.name}</strong>
            <span>{selected.email}</span>
            <small>{selected.department}</small>
          </div>
          <GraduationCap size={21} />
        </div>
      ) : null}
    </>
  );
}
