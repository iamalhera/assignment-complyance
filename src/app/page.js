import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div>
      <h1>Welcome to the Financial Transaction System</h1>
      <p>Please sign in to continue.</p>
    </div>
  );
}