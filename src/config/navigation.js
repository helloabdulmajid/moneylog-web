import { Wallet, Home, ReceiptText, Tags, CreditCard } from "lucide-react";

export const layoutNav = [
  { path: "/app", label: "Home", icon: Home },
  { path: "/dashboard", label: "Dashboard", icon: Wallet },
  { path: "/expenses", label: "Expenses", icon: ReceiptText },
  { path: "/categories", label: "Categories", icon: Tags },
  { path: "/payments", label: "Payment Methods", icon: CreditCard },
];