import { useQuery } from '@tanstack/react-query';
import { Grid, Paper, Typography } from '@mui/material';

function StatCard(props: { title: string; value: string | number }) {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.secondary' }}>
        {props.title}
      </Typography>
      <Typography variant="h4">{props.value}</Typography>
    </Paper>
  );
}

export default function Dashboard() {
  const { data: bins = [] } = useQuery<any[]>({
    queryKey: ['bins'],
    queryFn: () => fetch('/api/bins').then(r => r.json())
  });

  const total = bins.length;
  const filled = bins.filter(b => (b.latestFillPct ?? 0) >= 70).length;
  const avgFill =
    total === 0
      ? 0
      : Math.round(
          bins
            .filter(b => b.latestFillPct != null)
            .reduce((sum, b) => sum + b.latestFillPct!, 0) / total
        );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <StatCard title="Total Bins" value={total} />
      </Grid>
      <Grid item xs={12} md={4}>
        <StatCard title="Bins ≥ 70 %" value={filled} />
      </Grid>
      <Grid item xs={12} md={4}>
        <StatCard title="Average Fill %" value={avgFill} />
      </Grid>
    </Grid>
  );
}