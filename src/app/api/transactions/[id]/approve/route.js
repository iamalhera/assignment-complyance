import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { authOptions } from '../../auth/[...nextauth]/route';
import { logAction } from '@/lib/auditLog';

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'manager') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const transactions = await readDb('transactions');
  const transactionIndex = transactions.findIndex(t => t.id === id);
  if (transactionIndex === -1) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  }
  transactions[transactionIndex].status = 'Approved';
  await writeDb('transactions', transactions);
  await logAction('approve', transactions[transactionIndex], session.user);
  return NextResponse.json(transactions[transactionIndex]);
}