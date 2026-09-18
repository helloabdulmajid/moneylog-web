import { Wallet, Home, ReceiptText, Tags, CreditCard, Landmark, User } from "lucide-react";

export const layoutNav = [
  { path: "/app", label: "Home", icon: Home },
  { path: "/dashboard", label: "Dashboard", icon: Wallet },
  { path: "/expenses", label: "Expenses", icon: ReceiptText },
  { path: "/categories", label: "Categories", icon: Tags },
  { path: "/credit-cards", label: "Credit Cards", icon: CreditCard },
  { path: "/bill-payments", label: "Bill Payments", icon: Landmark },
  { path: "/payments", label: "Payment Methods", icon: Wallet },
  { path: "/app/profile", label: "Profile & Settings", icon: User },
];