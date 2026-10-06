export function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">
      {children}
    </span>
  );
}

export function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </div>
  );
}
