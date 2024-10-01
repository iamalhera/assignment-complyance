import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { authOptions } from '../auth/[...nextauth]/route';
import { logAction } from '@/lib/auditLog';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const transactions = await readDb('transactions');
  const filteredTransactions = session.user.role === 'manager'
    ? transactions
    : transactions.filter(t => t.userId === session.user.id);
  return NextResponse.json(filteredTransactions);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'employee') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type, amount, description } = await request.json();
  const newTransaction = {
    id: Date.now().toString(),
    userId: session.user.id,
    type,
    amount,
    description,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };
  const transactions = await readDb('transactions');
  transactions.push(newTransaction);
  await writeDb('transactions', transactions);
  await logAction('submit', newTransaction, session.user);
  return NextResponse.json(newTransaction, { status: 201 });
}