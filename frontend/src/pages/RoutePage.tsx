import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Button, Paper, Typography,
  List, ListItem, ListItemText
} from '@mui/material';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import RefreshIcon       from '@mui/icons-material/Refresh';

type Route = { distanceMeters: number; binOrder: number[] };

export default function RoutePage() {
  const [route, setRoute] = useState<Route>();

  const genRoute = useMutation({
    mutationFn: () => fetch('/api/route/today').then(r => r.json()),
    onSuccess: (data: Route) => setRoute(data)
  });

  return (
    <>
      <Button
        variant="contained"
        startIcon={<DirectionsRunIcon />}
        endIcon={<RefreshIcon />}
        onClick={() => genRoute.mutate()}
      >
        Generate Route
      </Button>

      {route && (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Pick-up Order
          </Typography>

          {route.binOrder.length === 0 ? (
            <Typography color="text.secondary">
              No bins over 70 % – nothing to collect 🎉
            </Typography>
          ) : (
            <List dense>
              {route.binOrder.map((id, idx) => (
                <ListItem key={id}>
                  <ListItemText primary={`Stop ${idx + 1}: Bin #${id}`} />
                </ListItem>
              ))}
            </List>
          )}

          <Typography sx={{ mt: 2 }}>
            Total Distance:&nbsp;
            <strong>{(route.distanceMeters / 1000).toFixed(2)} km</strong>
          </Typography>
        </Paper>
      )}
    </>
  );
}