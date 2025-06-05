import { useState } from 'react';
import {
  useQuery, useMutation, QueryClient, QueryClientProvider
} from '@tanstack/react-query';
import {
  Container, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';

const qc = new QueryClient();

type Bin = {
  id: number;
  name: string;
  lat: number;
  lon: number;
  capacityLiters: number;
  type: string;
  latestFillPct?: number;
};

export default function Root() {
  return (
    <QueryClientProvider client={qc}>
      <App />
    </QueryClientProvider>
  );
}

function App() {
  /* ---------- queries ---------- */
  const { data: bins = [] } = useQuery<Bin[]>({
    queryKey: ['bins'],
    queryFn: () => fetch('/api/bins').then(r => r.json()),
    refetchInterval: 5_000          // auto refresh every 5 s
  });

  /* ---------- mutations ---------- */
  const addBin = useMutation({
    mutationFn: (b: Partial<Bin>) =>
      fetch('/api/bins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(b)
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bins'] })
  });

  const addFill = useMutation({
    mutationFn: (payload: { binId: number; fillPct: number }) =>
      fetch('/api/fills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, tempC: 25 })
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bins'] })
  });

  const deleteBin = useMutation({
    mutationFn: (id: number) => fetch(`/api/bins/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bins'] })
  });

  const [route, setRoute] = useState<{ distanceMeters: number; binOrder: number[] }>();

  /* ---------- form state ---------- */
  const [name, setName] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [fillPct, setFillPct] = useState('');
  const [selectedBin, setSelectedBin] = useState<number>();

  /* ---------- actions ---------- */
  const genRoute = () =>
    fetch('/api/route/today')
      .then(r => r.json())
      .then(setRoute);



  return (
    <Container sx={{ mt: 4 }}>
      <h1>Smart-Bin Monitor</h1>

      {/* Add-bin form */}
      <h3>Add Bin</h3>
      <TextField label="Name" size="small" sx={{ mr: 1 }} value={name} onChange={e => setName(e.target.value)} />
      <TextField label="Lat" size="small" sx={{ mr: 1 }} value={lat} onChange={e => setLat(e.target.value)} />
      <TextField label="Lon" size="small" sx={{ mr: 1 }} value={lon} onChange={e => setLon(e.target.value)} />
      <Button variant="contained" onClick={() => {
        addBin.mutate({ name, lat: +lat, lon: +lon, capacityLiters: 50, type: 'TRASH' });
        setName(''); setLat(''); setLon('');
      }}>Save</Button>

      {/* Bin table */}
      <h3 style={{ marginTop: 32 }}>Bins</h3>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell><TableCell>Name</TableCell>
            <TableCell>Fill %</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bins.map(b => (
            <TableRow
              key={b.id}
              hover
              selected={selectedBin === b.id}
              sx={{ cursor: 'pointer' }}
              onClick={() => setSelectedBin(b.id)}
            >
              <TableCell>{b.id}</TableCell>
              <TableCell>{b.name}</TableCell>
              <TableCell>{b.latestFillPct ?? '-'}</TableCell>

              {/* NEW delete button cell */}
              <TableCell>
                <Button
                  color="error"
                  size="small"
                  onClick={e => {
                    e.stopPropagation();          // don’t toggle row-select
                    deleteBin.mutate(b.id);       // call mutation
                    if (selectedBin === b.id) setSelectedBin(undefined);
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Upload fill */}
      <h3 style={{ marginTop: 32 }}>Upload Fill Reading</h3>
      <TextField label="Bin ID" size="small" sx={{ mr: 1, width: 100 }} value={selectedBin ?? ''} disabled />
      <TextField label="Fill %" size="small" sx={{ mr: 1, width: 100 }} value={fillPct} onChange={e => setFillPct(e.target.value)} />
      <Button variant="contained" onClick={() => {
        if (selectedBin) addFill.mutate({ binId: selectedBin, fillPct: +fillPct });
        setFillPct('');
      }}>Submit</Button>

      {/* Route */}
      <h3 style={{ marginTop: 32 }}>Route</h3>
      <Button variant="contained" onClick={genRoute}>Generate Route</Button>
      {route && (
        <p style={{ marginTop: 8 }}>
          Order: {route.binOrder.join(' → ')} <br />
          Distance: {route.distanceMeters} m
        </p>
      )}
    </Container>
  );
}