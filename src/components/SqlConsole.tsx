import {
  Box,
  Button,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import {
  DataGrid,
  GridColDef
} from '@mui/x-data-grid';
import { useState } from 'react';
import { db } from '../lib/db';
import { notifyMutation } from '../lib/broadcast';

export default function SqlConsole() {
  const [sql, setSql]   = useState('select * from patient_info;');
  const [rows, setRows] = useState<any[]>([]);
  const [cols, setCols] = useState<GridColDef[]>([]);
  const [msg,  setMsg]  = useState<string>('');

  async function run() {
    try {
      const res = await db.query(sql);

      if (!res.rows.length) {
           const n = (res as any).affectedRows ?? 0;
           const plural = n === 1 ? '' : 's';
           setMsg(
             n ? `Success — ${n} row${plural} affected`
               : 'Success'
           );
           setRows([]);
           return;
         }

      const first = res.rows[0];
      const gridCols: GridColDef[] = Object.keys(first).map(k => ({
        field: k,
        headerName: k,
        flex: 1,
        minWidth: 120
      }));

      const gridRows = res.rows.map((r, i) =>
        ('id' in r ? r : { id: i, ...r })
      );

      setCols(gridCols);
      setRows(gridRows);
      setMsg('');
    } catch (e: any) {
      setRows([]);
      setMsg(e.message);
    } finally {

      if (/^\s*(insert|update|delete|create|alter|drop)/i.test(sql)) {
        notifyMutation();
      }
    }
  }


  return (
    <>
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          label="SQL"
          multiline
          minRows={4}
          fullWidth
          value={sql}
          onChange={e => setSql(e.target.value)}
        />
        <Button onClick={run} variant="contained" sx={{ mt: 2 }}>
          Run
        </Button>
      </Paper>

      <Paper sx={{ p: 2 }}>
        {rows.length ? (
          <Box sx={{ height: 400 }}>
            <DataGrid
              rows={rows}
              columns={cols}
              getRowId={r => r.id}
              density="compact"
              pageSizeOptions={[10, 25, 50]}
            />
          </Box>
        ) : (
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {msg || 'No rows returned.'}
          </Typography>
        )}
      </Paper>
    </>
  );
}
