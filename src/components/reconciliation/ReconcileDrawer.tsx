import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Transaction } from "./TransactionGrid";
import { AIMatchCard } from "./AIMatchCard";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, AlertTriangle, Upload, Sparkles, Search, Plus, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReconcileDrawerProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReconcile: (transactionId: string, matchId: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const mockMatches = [
  {
    id: "1",
    invoiceNumber: "Inv #2024-99",
    date: "25-04-2029",
    amount: 150.0,
    confidence: 95,
    reason: "Exact match found on Amount (150.00) and Supplier Name in existing bills.",
  },
  {
    id: "2",
    invoiceNumber: "Inv #2024-91",
    date: "26-03-2029",
    amount: 150.0,
    confidence: 60,
    reason: "Amount matches exactly, but date is 1 month off.",
  },
  {
    id: "3",
    invoiceNumber: "Inv #2024-85",
    date: "26-02-2029",
    amount: 150.0,
    confidence: 45,
    reason: "Amount matches, date is 2 months off.",
  },
];

export const ReconcileDrawer = ({
  transaction,
  open,
  onOpenChange,
  onReconcile,
  onPrevious,
  onNext,
}: ReconcileDrawerProps) => {
  const [selectedMatchId, setSelectedMatchId] = useState<string>(mockMatches[0].id);
  const [activeTab, setActiveTab] = useState("ai-suggestions");

  if (!transaction) return null;

  const formatAmount = (amount: number, type: "debit" | "credit") => {
    const formatted = new Intl.NumberFormat("en-AE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return `${formatted} AED (${type === "debit" ? "Dr" : "Cr"})`;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0 gap-0">
        <SheetHeader className="px-6 py-4 border-b border-border bg-card shrink-0">
          <SheetTitle className="text-lg font-semibold">
            Reconcile Transaction
          </SheetTitle>
        </SheetHeader>

        {/* Source Truth Section */}
        <div className="px-6 py-4 bg-info/5 border-b border-info/20 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Source Truth Section</h3>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              <Lock className="h-3 w-3" />
              Read-only
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-mono text-foreground">{transaction.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Desc:</span>
              <span className="font-medium text-foreground text-right max-w-[250px] truncate">
                {transaction.description}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className={cn(
                "font-mono font-bold text-base",
                transaction.type === "credit" ? "text-success" : "text-foreground"
              )}>
                {formatAmount(transaction.amount, transaction.type)}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-6 shrink-0">
            <TabsTrigger
              value="ai-suggestions"
              className="gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              <Sparkles className="h-4 w-4" />
              AI Suggestions ({mockMatches.length})
            </TabsTrigger>
            <TabsTrigger
              value="find-match"
              className="gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              <Search className="h-4 w-4" />
              Find & Match
            </TabsTrigger>
            <TabsTrigger
              value="create-new"
              className="gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              <Plus className="h-4 w-4" />
              Create New
            </TabsTrigger>
          </TabsList>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="ai-suggestions" className="p-6 m-0 space-y-4">
              {mockMatches.length > 1 && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20 text-sm">
                  <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                  <span className="text-warning-foreground">
                    Multiple potential matches found. Please select the correct invoice.
                  </span>
                </div>
              )}

              <div className="space-y-3">
                {mockMatches.map((match, index) => (
                  <AIMatchCard
                    key={match.id}
                    match={match}
                    isSelected={selectedMatchId === match.id}
                    isBestMatch={index === 0}
                    onSelect={setSelectedMatchId}
                  />
                ))}
              </div>

              <Button variant="link" className="px-0 text-primary">
                + Show 7 other matches...
              </Button>

              {/* Suggested Match Details for Selected Invoice */}
              {selectedMatchId && (
                <>
                  <Separator className="my-4" />
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Suggested Match Details
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-xs">Transaction Type</span>
                        <p className="font-medium text-foreground">Bill Payment</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-xs">Contact</span>
                        <p className="font-medium text-foreground">Transfernon Tech</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-xs">Account</span>
                        <p className="font-medium text-foreground">6400 - Bank Fees</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-xs">Reference</span>
                        <p className="font-medium text-foreground font-mono">INV-AUTO-991</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="find-match" className="p-6 m-0">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search invoices, bills, payments..." className="pl-9" />
              </div>
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Search for existing records to match this transaction</p>
              </div>
            </TabsContent>

            <TabsContent value="create-new" className="p-6 m-0 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Transaction Type</Label>
                  <Select defaultValue="bill-payment">
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bill-payment">Bill Payment</SelectItem>
                      <SelectItem value="expense">Expense Voucher</SelectItem>
                      <SelectItem value="transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact</Label>
                  <Select>
                    <SelectTrigger id="contact">
                      <SelectValue placeholder="Select contact" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transfernon">Transfernon Tech</SelectItem>
                      <SelectItem value="etisalat">Etisalat</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="account">Account</Label>
                  <Select>
                    <SelectTrigger id="account">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6400">6400 - Bank Fees</SelectItem>
                      <SelectItem value="6100">6100 - Utilities</SelectItem>
                      <SelectItem value="5000">5000 - Cost of Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax">Tax</Label>
                  <Select defaultValue="gst">
                    <SelectTrigger id="tax">
                      <SelectValue placeholder="Select tax" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gst">GST (5%)</SelectItem>
                      <SelectItem value="none">No Tax</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ref">Reference</Label>
                  <Input id="ref" placeholder="Enter reference..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project">Project</Label>
                  <Select>
                    <SelectTrigger id="project">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="proj-1">Project Alpha</SelectItem>
                      <SelectItem value="proj-2">Project Beta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Add internal note here..." rows={3} />
              </div>

              <div className="space-y-2">
                <Label>Attachments</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag & drop files here or click to browse
                  </p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Sticky Footer */}
        <div className="px-6 py-4 border-t border-border bg-card flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onPrevious} className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={onNext} className="gap-1">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => onReconcile(transaction.id, selectedMatchId)}
            >
              Reconcile Item
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
