import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Sparkles, ChevronDown } from "lucide-react";

interface TransactionToolbarProps {
  selectedCount: number;
  onAutoReconcile: () => void;
}

export const TransactionToolbar = ({
  selectedCount,
  onAutoReconcile,
}: TransactionToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search Transactions..."
          className="pl-9 bg-background"
        />
      </div>

      <Select defaultValue="last-30">
        <SelectTrigger className="w-[160px] bg-background">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="last-7">Last 7 Days</SelectItem>
          <SelectItem value="last-30">Last 30 Days</SelectItem>
          <SelectItem value="last-90">Last 90 Days</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all">
        <SelectTrigger className="w-[140px] bg-background">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="ai-match">AI Match</SelectItem>
          <SelectItem value="reconciled">Reconciled</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex-1" />

      <Select disabled={selectedCount === 0}>
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue placeholder={`Bulk Actions (${selectedCount} selected)`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="reconcile">Reconcile Selected</SelectItem>
          <SelectItem value="ignore">Ignore Selected</SelectItem>
          <SelectItem value="export">Export Selected</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={onAutoReconcile} className="gap-2">
        <Sparkles className="h-4 w-4" />
        Run Auto-Reconcile Rules
      </Button>
    </div>
  );
};
