import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  IconButton,
  Snackbar,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  WaterDrop as FillIcon,
} from '@mui/icons-material';

type Bin = {
  id: number;
  name: string;
  lat: number;
  lon: number;
  capacityLiters: number;
  type: string;
  latestFillPct?: number | null;
};

export default function BinsPage() {
  const qc = useQueryClient();

  // Fetch bins
  const { data: bins = [] } = useQuery<Bin[]>({
    queryKey: ['bins'],
    queryFn: () => fetch('/api/bins').then(r => r.json()),
  });

  // Mutations
  const addBin = useMutation({
    mutationFn: (b: Partial<Bin>) =>
      fetch('/api/bins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(b),
      }),
    onSuccess: () => qc.invalidateQueries(['bins']),
  });

  const delBin = useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/bins/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries(['bins']),
  });

  const addFill = useMutation({
    mutationFn: (payload: { binId: number; pct: number }) =>
      fetch('/api/fills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ binId: payload.binId, fillPct: payload.pct, tempC: 25 }),
      }),
    onSuccess: () => qc.invalidateQueries(['bins']),
  });

  // Local state
  const [openBin, setOpenBin] = useState(false);
  const [openFill, setOpenFill] = useState<{ id: number; name: string } | null>(null);
  const [form, setForm] = useState<Partial<Bin>>({});
  const [pct, setPct] = useState('');
  const [snack, setSnack] = useState<string>();

  // Columns for DataGrid
  const cols: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 60 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'capacityLiters', headerName: 'Cap (L)', width: 90 },
    { field: 'latestFillPct', headerName: 'Fill %', width: 90 },
    {
      field: 'fill',
      headerName: '',
      width: 50,
      sortable: false,
      renderCell: params => (
        <IconButton
          color="primary"
          onClick={() => setOpenFill({ id: params.row.id, name: params.row.name })}
        >
          <FillIcon />
        </IconButton>
      ),
    },
    {
      field: 'del',
      headerName: '',
      width: 50,
      sortable: false,
      renderCell: params => (
        <IconButton color="error" onClick={() => delBin.mutate(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  // Handlers
  const saveBin = () => {
    if (
      !form.name ||
      form.lat == null ||
      form.lon == null ||
      form.capacityLiters == null
    ) {
      setSnack('Please fill all fields');
      return;
    }
    addBin.mutate({ ...form, type: 'TRASH' });
    setForm({});
    setOpenBin(false);
  };

  const saveFill = () => {
    const num = +pct;
    if (!openFill || isNaN(num) || num < 0 || num > 100) {
      setSnack('Fill % must be between 0 and 100');
      return;
    }
    addFill.mutate({ binId: openFill.id, pct: num });
    setPct('');
    setOpenFill(null);
  };

  return (
    <>
      {/* Add Bin button */}
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => setOpenBin(true)}
      >
        Add Bin
      </Button>

      {/* Table */}
      <div style={{ height: 460, width: '100%' }}>
        <DataGrid
          rows={bins}
          columns={cols}
          getRowId={r => r.id}
          disableRowSelectionOnClick
        />
      </div>

      {/* Add-Bin Dialog */}
      <Dialog open={openBin} onClose={() => setOpenBin(false)}>
        <DialogTitle>Add Bin</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, width: 320 }}>
            <TextField
              label="Name"
              value={form.name ?? ''}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Lat"
                type="number"
                value={form.lat ?? ''}
                onChange={e => setForm({ ...form, lat: +e.target.value })}
              />
              <TextField
                fullWidth
                label="Lon"
                type="number"
                value={form.lon ?? ''}
                onChange={e => setForm({ ...form, lon: +e.target.value })}
              />
            </Stack>
            <TextField
              label="Capacity (L)"
              type="number"
              value={form.capacityLiters ?? ''}
              onChange={e => setForm({ ...form, capacityLiters: +e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBin(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveBin}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Fill Dialog */}
      <Dialog open={!!openFill} onClose={() => setOpenFill(null)}>
        <DialogTitle>Add Fill – {openFill?.name}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Fill %"
            type="number"
            value={pct}
            onChange={e => setPct(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFill(null)}>Cancel</Button>
          <Button variant="contained" onClick={saveFill}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for errors */}
      <Snackbar
        open={!!snack}
        autoHideDuration={2500}
        onClose={() => setSnack(undefined)}
        message={snack}
      />
    </>
  );
}