import { readDb, writeDb } from './db';

export async function logAction(action, transaction, user) {
  const logEntry = {
    id: Date.now().toString(),
    action,
    transactionId: transaction.id,
    userId: user.id,
    userEmail: user.email,
    timestamp: new Date().toISOString(),
  };
  const logs = await readDb('auditLogs');
  logs.push(logEntry);
  await writeDb('auditLogs', logs);
}