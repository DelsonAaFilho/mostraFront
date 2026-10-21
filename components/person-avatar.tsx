import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function PersonAvatar({
  name,
  image,
  className,
}: {
  name: string;
  image?: string;
  className?: string;
}) {
  const initials = name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("");
  return (
    <Avatar className={cn("person-avatar", className)}>
      {image ? <AvatarImage src={image} alt={name} /> : null}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
