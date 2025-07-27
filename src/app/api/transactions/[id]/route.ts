import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
    try {
        // Extract id from the URL path
        const url = new URL(request.url);
        const pathname = url.pathname;
        // Assuming the route is /api/transactions/[id], extract id from pathname
        const parts = pathname.split('/');
        const idStr = parts[parts.length - 1];
        const id = parseInt(idStr);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid transaction ID' },
                { status: 400 }
            );
        }

        await query('DELETE FROM transactions WHERE id = ?', [id]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        return NextResponse.json(
            { error: 'Failed to delete transaction' },
            { status: 500 }
        );
    }
}
