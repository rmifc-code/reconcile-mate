import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { TransactionToolbar } from "@/components/reconciliation/TransactionToolbar";
import { TransactionGrid, Transaction } from "@/components/reconciliation/TransactionGrid";
import { ReconcileDrawer } from "@/components/reconciliation/ReconcileDrawer";
import { toast } from "@/hooks/use-toast";

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "26-04-2029",
    description: "Transfernon Maintenance of Balance Fee...",
    refId: "26-04/2029",
    status: "pending",
    amount: 150.0,
    type: "debit",
  },
  {
    id: "2",
    date: "26-04-2029",
    description: "Transfernon Maintenance Account Services",
    refId: "26-04/2021",
    status: "ai-match",
    confidence: 65,
    amount: 1000.0,
    type: "credit",
  },
  {
    id: "3",
    date: "26-04-2029",
    description: "Transfernon Maintenance Monthly Charge",
    refId: "26-04-2025",
    status: "reconciled",
    amount: 150.0,
    type: "debit",
  },
  {
    id: "4",
    date: "26-04-2029",
    description: "Transfernon Maintenance Quarterly Review",
    refId: "26-04-2024",
    status: "reconciled",
    amount: 1000.0,
    type: "credit",
  },
  {
    id: "5",
    date: "26-04-2029",
    description: "Transfernon Maintenance Service Fee",
    refId: null,
    status: "pending",
    amount: 150.0,
    type: "debit",
  },
  {
    id: "6",
    date: "26-04-2029",
    description: "Transfernon Maintenance Annual Premium",
    refId: "26-04-2029",
    status: "reconciled",
    amount: 150.0,
    type: "debit",
  },
  {
    id: "7",
    date: "26-04-2029",
    description: "Transfernon Maintenance Network Access",
    refId: "26-04-2027",
    status: "pending",
    amount: 1000.0,
    type: "credit",
  },
  {
    id: "8",
    date: "26-04-2029",
    description: "Transfernon Maintenance Security Patch",
    refId: "26-04-2029",
    status: "reconciled",
    amount: 150.0,
    type: "debit",
  },
  {
    id: "9",
    date: "26-04-2029",
    description: "Transfernon Maintenance Software Update",
    refId: "26-04-2026",
    status: "reconciled",
    amount: 1000.0,
    type: "credit",
  },
  {
    id: "10",
    date: "26-04-2029",
    description: "Transfernon Maintenance Hardware Lease",
    refId: "26-04-2021",
    status: "pending",
    amount: 150.0,
    type: "debit",
  },
  {
    id: "11",
    date: "26-04-2029",
    description: "Transfernon Maintenance Support Contract",
    refId: "26-04-2022",
    status: "pending",
    amount: 150.0,
    type: "debit",
  },
  {
    id: "12",
    date: "26-04-2029",
    description: "Transfernon Maintenance License Renewal",
    refId: "26-04-2023",
    status: "pending",
    amount: 150.0,
    type: "debit",
  },
  {
    id: "13",
    date: "26-04-2029",
    description: "Transfernon Maintenance Cloud Hosting",
    refId: "26-04-2024",
    status: "reconciled",
    amount: 1000.0,
    type: "credit",
  },
];

const BankReconciliationPage = () => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [transactions, setTransactions] = useState(mockTransactions);

  const handleAutoReconcile = () => {
    toast({
      title: "Auto-Reconcile Started",
      description: "Analyzing transactions with AI rules...",
    });
  };

  const handleReconcile = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDrawerOpen(true);
  };

  const handleConfirmReconcile = (transactionId: string, matchId: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? { ...t, status: "reconciled" as const, refId: `REC-${Date.now()}` }
          : t
      )
    );
    setDrawerOpen(false);
    toast({
      title: "Transaction Reconciled",
      description: "The transaction has been successfully matched and reconciled.",
    });
  };

  const handlePrevious = () => {
    if (!selectedTransaction) return;
    const currentIndex = transactions.findIndex((t) => t.id === selectedTransaction.id);
    if (currentIndex > 0) {
      setSelectedTransaction(transactions[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (!selectedTransaction) return;
    const currentIndex = transactions.findIndex((t) => t.id === selectedTransaction.id);
    if (currentIndex < transactions.length - 1) {
      setSelectedTransaction(transactions[currentIndex + 1]);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Bank Reconciliation - Checking Account *9041
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Match bank transactions with your accounting records
              </p>
            </div>

            {/* Toolbar */}
            <TransactionToolbar
              selectedCount={selectedIds.size}
              onAutoReconcile={handleAutoReconcile}
            />

            {/* Transaction Grid */}
            <TransactionGrid
              transactions={transactions}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onReconcile={handleReconcile}
            />
          </div>
        </main>
      </div>

      {/* Reconcile Drawer */}
      <ReconcileDrawer
        transaction={selectedTransaction}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onReconcile={handleConfirmReconcile}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
};

export default BankReconciliationPage;
