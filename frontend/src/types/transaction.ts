export interface Transaction {
  id: string;
  value: number;
  timestamp: number;
  receiver: string;
  confirmed: boolean;
  sender: string;
}

export interface CreateTransaction {
  sender: string;
  receiver: string;
  value: number;
  confirmed: boolean;
}

export interface UpdateTransaction extends Partial<CreateTransaction> {
  id: string;
}

export interface DeleteTransaction {
  id: string;
}
