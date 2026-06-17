import {
  Users,
  Monitor,
  DollarSign,
  MessageCircle,
  Shield,
  BookOpen,
  Store,
  BarChart2,
  Globe,
  Compass,
  Zap,
  TrendingUp,
  BarChart3,
  Layers,
  ClipboardList,
  Lightbulb,
  Search,
  Map,
  Mail,
  Phone,
  MapPin,
  LucideIcon,
} from "lucide-react";

export const capabilityIcons: Record<string, LucideIcon> = {
  "01": Users,
  "02": Monitor,
  "03": DollarSign,
  "04": MessageCircle,
  "05": Shield,
  "06": BookOpen,
  "07": Store,
  "08": BarChart2,
  "09": Globe,
  "10": Compass,
};

export const outcomeIcons: Record<string, LucideIcon> = {
  shield: Shield,
  zap: Zap,
  users: Users,
  "trending-up": TrendingUp,
  "bar-chart": BarChart3,
  layers: Layers,
};

export const categoryIcons: Record<string, LucideIcon> = {
  guides: BookOpen,
  "case-studies": ClipboardList,
  insights: Lightbulb,
};

export const consultationBenefitIcons: LucideIcon[] = [Search, Map, Lightbulb];

export const contactMethodIcons: Record<string, LucideIcon> = {
  email: Mail,
  phone: Phone,
  office: MapPin,
};
