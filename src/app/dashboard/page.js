import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';
import TransactionTable from '../components/TransactionTable';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user.email}</p>
      {session.user.role === 'employee' && (
        <a href="/submit-transaction">Submit New Transaction</a>
      )}
      <TransactionTable userRole={session.user.role} />
    </div>
  );
}