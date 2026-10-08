import {
  LayoutDashboard,
  MessageSquareWarning,
  Users,
  Flag,
  ScrollText,
  UserCog,
} from "lucide-react";

export const adminNav = [
  {
    path: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    permission: "dashboard:view",
    end: true,
  },
  {
    path: "/admin/feedback",
    label: "Feedback",
    icon: MessageSquareWarning,
    permission: "feedback:read",
  },
  {
    path: "/admin/users",
    label: "Users",
    icon: Users,
    permission: "users:read",
  },
  {
    path: "/admin/flags",
    label: "Feature Flags",
    icon: Flag,
    permission: "flags:read",
  },
  {
    path: "/admin/audit",
    label: "Audit Log",
    icon: ScrollText,
    permission: "audit:read",
  },
  {
    path: "/admin/profile",
    label: "My Account",
    icon: UserCog,
    permission: null,
  },
];
