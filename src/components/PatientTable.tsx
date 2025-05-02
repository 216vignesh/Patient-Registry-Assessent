import { useEffect, useState } from 'react';
import { db } from '../lib/db';
import {
  DataGrid,
  GridColDef
} from '@mui/x-data-grid';
import { onMutations } from '../lib/broadcast';
import { Box } from '@mui/material';

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  dob: string | null;
  gender: string | null;
  phone: string | null;
  created_at: string;
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 60 },
  { field: 'first_name', headerName: 'First name', flex: 1 },
  { field: 'last_name', headerName: 'Last name', flex: 1 },
  { field: 'dob', headerName: 'DOB', width: 110 },
  { field: 'gender', headerName: 'Gender', width: 110 },
  { field: 'phone', headerName: 'Phone', width: 140 },
  { field: 'created_at', headerName: 'Created', width: 170 }
];

export default function PatientTable() {
  const [rows, setRows] = useState<Patient[]>([]);

  async function load() {
    const { rows } = await db.query<Patient>('select * from patient_info order by id desc');
    setRows(rows);
  }

  useEffect(() => {
    load();
    const off = onMutations(load);
    return () => { off(); };
  }, []);

  return (
    <Box sx={{ height: 500 }}>
      <DataGrid rows={rows} columns={columns} getRowId={r => r.id} />
    </Box>
  );
}
