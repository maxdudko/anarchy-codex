'use client';

interface TagChipsProps {
  tags?: string[];
  onSelect?: (tag: string) => void;
}

export default function TagChips({ tags = [], onSelect }: TagChipsProps) {
  if (!tags.length) {
    return null;
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          className="rounded border border-cyan-800 px-2 py-0.5 text-xs text-cyan-300 hover:border-cyan-400"
          onClick={() => onSelect?.(tag)}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
