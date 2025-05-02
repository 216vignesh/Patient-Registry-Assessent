import { Box, Button, Paper, TextField } from '@mui/material';
import { useState } from 'react';
import { db } from '../lib/db';
import { notifyMutation } from '../lib/broadcast';

export default function SqlConsole() {
  const [sql, setSql] = useState('select * from patient_info;');
  const [result, setResult] = useState<string>('');

  async function run() {
    try {
      const res = await db.query(sql);
      setResult(JSON.stringify(res.rows, null, 2));
      if (/^\s*(insert|update|delete|create|alter|drop)/i.test(sql)) {
        notifyMutation();
      }
    } catch (e: any) {
      setResult(e.message);
    }
  }

  return (
    <>
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          multiline
          minRows={4}
          label="SQL"
          fullWidth
          value={sql}
          onChange={e => setSql(e.target.value)}
        />
        <Button onClick={run} variant="contained" sx={{ mt: 2 }}>
          Run
        </Button>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <pre style={{ margin: 0, maxHeight: 400, overflow: 'auto' }}>{result}</pre>
      </Paper>
    </>
  );
}
