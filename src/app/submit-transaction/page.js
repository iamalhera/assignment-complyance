import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';
import TransactionForm from '../components/TransactionForm';

export default async function SubmitTransaction() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'employee') {
    redirect('/');
  }

  return (
    <div>
      <h1>Submit Transaction</h1>
      <TransactionForm />
    </div>
  );
}