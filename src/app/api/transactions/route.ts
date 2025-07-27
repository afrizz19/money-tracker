import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Transaction } from '@/types';

export async function GET() {
    try {
        const transactions = await query(
            'SELECT * FROM transactions ORDER BY date_time DESC'
        );
        return NextResponse.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch transactions' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: Transaction = await request.json();
        const { type, amount, description, usage, date_time } = body;

        const result = await query<{ insertId: number }>(
            'INSERT INTO transactions (type, amount, description, `usage`, date_time) VALUES (?, ?, ?, ?, ?)',
            [type, amount, description, usage, date_time]
        );

        return NextResponse.json({ success: true, id: result[0]?.insertId });
    } catch (error) {
        console.error('Error creating transaction:', error);
        return NextResponse.json(
            { error: 'Failed to create transaction' },
            { status: 500 }
        );
    }
}