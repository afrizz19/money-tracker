import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Settings } from '@/types';

export async function GET() {
    try {
        const settings = await query('SELECT * FROM settings LIMIT 1') as any;
        return NextResponse.json(settings[0] || { initial_balance: 0, currency: 'IDR' });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body: Settings = await request.json();
        const { initial_balance, currency } = body;

        await query(
            'UPDATE settings SET initial_balance = ?, currency = ? WHERE id = 1',
            [initial_balance, currency]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
        );
    }
} 