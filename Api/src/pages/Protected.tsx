import { useUser } from '@clerk/clerk-react';

export default function Protected() {
  const { user } = useUser();

  return (
    <div>
      <h1>Protected Page</h1>
      <p>Welcome, {user?.firstName}!</p>
      <p>This page is only accessible to authenticated users.</p>
    </div>
  );
}