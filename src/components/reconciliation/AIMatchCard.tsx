import { Card, CardContent } from "@/components/ui/card";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface AIMatch {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  confidence: number;
  reason: string;
}

interface AIMatchCardProps {
  match: AIMatch;
  isSelected: boolean;
  isBestMatch?: boolean;
  onSelect: (id: string) => void;
}

export const AIMatchCard = ({
  match,
  isSelected,
  isBestMatch,
  onSelect,
}: AIMatchCardProps) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-success";
    if (confidence >= 70) return "text-info";
    if (confidence >= 50) return "text-warning";
    return "text-muted-foreground";
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected
          ? "border-success bg-success/5 ring-2 ring-success/20"
          : "border-border hover:border-primary/30"
      )}
      onClick={() => onSelect(match.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <div
              className={cn(
                "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
                isSelected
                  ? "border-success bg-success"
                  : "border-muted-foreground/30"
              )}
            >
              {isSelected && (
                <CheckCircle2 className="h-3 w-3 text-success-foreground" />
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {match.invoiceNumber}
                </span>
                {isBestMatch && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                    <Sparkles className="h-3 w-3" />
                    Best Match
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "font-semibold text-sm",
                  getConfidenceColor(match.confidence)
                )}
              >
                {match.confidence}%
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <span>Date: {match.date}</span>
              <span className="font-mono">
                Amount: {match.amount.toLocaleString("en-AE", {
                  minimumFractionDigits: 2,
                })} AED
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{match.reason}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
