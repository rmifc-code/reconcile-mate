import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, Clock, Sparkles } from "lucide-react";

export type TransactionStatus = "pending" | "ai-match" | "reconciled";

interface StatusBadgeProps {
  status: TransactionStatus;
  confidence?: number;
}

export const StatusBadge = ({ status, confidence }: StatusBadgeProps) => {
  const variants = {
    pending: {
      className: "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20",
      icon: Clock,
      label: "Pending",
    },
    "ai-match": {
      className: "bg-info/10 text-info border-info/20 hover:bg-info/20",
      icon: Sparkles,
      label: `AI Match ${confidence ?? 0}%`,
    },
    reconciled: {
      className: "bg-success/10 text-success border-success/20 hover:bg-success/20",
      icon: Check,
      label: "Reconciled",
    },
  };

  const variant = variants[status];
  const Icon = variant.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 font-medium transition-colors",
        variant.className
      )}
    >
      <Icon className="h-3 w-3" />
      {variant.label}
    </Badge>
  );
};
