import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppShell from './components/AppShell';
import Dashboard from './pages/Dashboard';
import BinsPage from './pages/BinsPage';
import RoutePage from './pages/RoutePage';

const qc = new QueryClient();

export default function Root() {
  const [page,setPage] = useState<'dashboard'|'bins'|'route'>('dashboard');

  const Current = page==='dashboard' ? Dashboard :
                  page==='bins'      ? BinsPage   : RoutePage;

  return (
    <QueryClientProvider client={qc}>
      <AppShell page={page} onNav={(p)=>setPage(p)}>
        <Current />
      </AppShell>
    </QueryClientProvider>
  );
}