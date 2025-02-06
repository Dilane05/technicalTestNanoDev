export interface Transaction {
  id: string;
  value: number;
  timestamp: number;
  receiver: string;
  confirmed: boolean;
  sender: string;
}
