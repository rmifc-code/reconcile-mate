import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { StatusBadge, TransactionStatus } from "./StatusBadge";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Eye, Link2, FileSearch, MoreHorizontal, Copy, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  refId: string | null;
  status: TransactionStatus;
  confidence?: number;
  amount: number;
  type: "debit" | "credit";
}

interface TransactionGridProps {
  transactions: Transaction[];
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onReconcile: (transaction: Transaction) => void;
}

export const TransactionGrid = ({
  transactions,
  selectedIds,
  onSelectionChange,
  onReconcile,
}: TransactionGridProps) => {
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(new Set(transactions.map((t) => t.id)));
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    const newSelection = new Set(selectedIds);
    if (checked) {
      newSelection.add(id);
    } else {
      newSelection.delete(id);
    }
    onSelectionChange(newSelection);
  };

  const formatAmount = (amount: number, type: "debit" | "credit") => {
    const formatted = new Intl.NumberFormat("en-AE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return `${formatted} ${type === "debit" ? "Dr" : "Cr"}`;
  };

  const getActionIcon = (status: TransactionStatus) => {
    switch (status) {
      case "pending":
        return Link2;
      case "ai-match":
        return FileSearch;
      case "reconciled":
        return Eye;
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.size === transactions.length && transactions.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[110px]">
              <Button variant="ghost" size="sm" className="gap-1 -ml-3 font-semibold">
                Date
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="min-w-[250px]">Bank Transaction Details</TableHead>
            <TableHead className="w-[120px]">Ref ID</TableHead>
            <TableHead className="w-[140px]">Status</TableHead>
            <TableHead className="w-[130px] text-right">Amount (AED)</TableHead>
            <TableHead className="w-[100px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, index) => {
            const ActionIcon = getActionIcon(transaction.status);
            const isSelected = selectedIds.has(transaction.id);
            
            return (
              <TableRow
                key={transaction.id}
                className={cn(
                  "transition-colors cursor-pointer",
                  isSelected && "bg-primary/5",
                  transaction.status === "ai-match" && "bg-info/5",
                  transaction.status === "reconciled" && "bg-muted/30"
                )}
                onClick={() => onReconcile(transaction)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      handleSelect(transaction.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {transaction.date}
                </TableCell>
                <TableCell>
                  <span className="font-medium text-foreground line-clamp-1">
                    {transaction.description}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {transaction.refId || "-"}
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={transaction.status}
                    confidence={transaction.confidence}
                  />
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-mono font-medium",
                    transaction.type === "credit"
                      ? "text-success"
                      : "text-foreground"
                  )}
                >
                  {formatAmount(transaction.amount, transaction.type)}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReconcile(transaction);
                      }}
                    >
                      <ActionIcon className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View in Bank
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        <span>Showing {transactions.length} of 2,400 transactions</span>
        <Button variant="outline" size="sm">
          Load More
        </Button>
      </div>
    </div>
  );
};
