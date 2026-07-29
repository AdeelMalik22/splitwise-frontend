export type Member = { id: string; name: string; initial: string; owes?: boolean; amount: string };
export type Expense = { id: string; title: string; detail: string; split: string; amount: string; date: string; positive?: boolean; icon?: string };
export const members: Member[] = [
  { id: "aman", name: "You (Aman)", initial: "A", amount: "₹400" }, { id: "riya", name: "Riya", initial: "R", amount: "₹400" },
  { id: "karan", name: "Karan", initial: "K", amount: "₹400" }, { id: "neha", name: "Neha", initial: "N", amount: "₹400" },
  { id: "arjun", name: "Arjun", initial: "A", amount: "₹400" }, { id: "mehak", name: "Mehak", initial: "M", amount: "₹400" },
];
export const expenses: Expense[] = [
  { id: "1", title: "Coffee at Blue Tokai", detail: "You paid ₹450", split: "Split between 3", amount: "+₹300", date: "Today", positive: true, icon: "☕" },
  { id: "2", title: "Dinner at Momos Place", detail: "Riya paid ₹840", split: "Split between 4", amount: "-₹210", date: "Yesterday", icon: "◉" },
  { id: "3", title: "Trip to Manali", detail: "You paid ₹8,120", split: "Split between 6", amount: "+₹1,550", date: "12 May", positive: true, icon: "◒" },
  { id: "4", title: "Groceries", detail: "Karan paid ₹1,200", split: "Split between 3", amount: "-₹400", date: "10 May", icon: "▱" },
];
export const groups = [
  { id: 1, name: "Goa Trip", count: 6, balance: "You are owed ₹1,550", icon: "♨" }, { id: 2, name: "Flatmates", count: 4, balance: "You owe ₹850", icon: "⌂" },
  { id: 3, name: "Office Team", count: 8, balance: "You are owed ₹950", icon: "♧" }, { id: 4, name: "College Friends", count: 10, balance: "You owe ₹300", icon: "♙" },
  { id: 5, name: "Family", count: 5, balance: "You are owed ₹1,000", icon: "♧" },
];
