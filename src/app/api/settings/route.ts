import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Settings } from '@/types';

export async function GET() {
    try {
        const settings = await query<Settings>('SELECT initial_balance FROM settings LIMIT 1');
        return NextResponse.json(settings[0] || { initial_balance: 0 });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

 