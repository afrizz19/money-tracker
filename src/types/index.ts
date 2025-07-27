export interface Transaction {
    id?: number;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    usage: string;
    date_time: string;
    created_at?: string;
    updated_at?: string;
}

export interface Settings {
    id?: number;
    initial_balance: number;
    created_at?: string;
    updated_at?: string;
}

export interface MoneyTracker {
    total_income: number;
    total_expenses: number;
    current_balance: number;
    initial_balance: number;
} 