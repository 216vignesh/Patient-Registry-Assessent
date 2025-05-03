import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography
  } from '@mui/material';
  import { DataGrid, GridColDef } from '@mui/x-data-grid';
  import { useState } from 'react';
  import { db } from '../lib/db';
  
 
  type Field =
    | 'first_name'
    | 'last_name'
    | 'city'
    | 'state'
    | 'gender'
    | 'phone'
    | 'email'
    | 'zip'
    | 'dob';
  
  const fields = [
    { value: 'first_name', label: 'First name' },
    { value: 'last_name', label: 'Last name' },
    { value: 'city', label: 'City' },
    { value: 'state', label: 'State' },
    { value: 'gender', label: 'Gender' },
    { value: 'phone', label: 'Phone' },
    { value: 'email', label: 'Email' },
    { value: 'zip', label: 'ZIP' },
    { value: 'dob', label: 'DOB (YYYY-MM-DD)' }
  ] as const;
  
  const ops = [
    { value: '=', label: '=' },
    { value: '!=', label: '≠' },
    { value: 'LIKE', label: 'contains' },
    { value: '>', label: '>' },
    { value: '<', label: '<' }
  ];
  
  interface Condition {
    field: Field;
    op: string;
    val: string;
  }
  
 
  export default function PatientQuery() {
    const [cond, setCond] = useState<Condition>({
      field: 'first_name',
      op: '=',
      val: ''
    });
    const [where, setWhere]       = useState<Condition[]>([]);
    const [rows, setRows]         = useState<any[]>([]);
    const [cols, setCols]         = useState<GridColDef[]>([]);
  
   
    const handleAdd = () => {
      if (cond.val.trim()) {
        setWhere([...where, cond]);
        setCond({ ...cond, val: '' });
      }
    };
  
    
    const handleDelete = (i: number) =>
      setWhere(where.filter((_, idx) => idx !== i));
  
    
    const run = async () => {
      if (!where.length) return;
  
      
      const clauses = where.map((c, i) => {
        const col   = `"${c.field}"`;
        const param = `$${i + 1}`;
  
        if (c.op === 'LIKE')
          return `${col} ILIKE ${param}`;
        if (c.op === '=')
          return `LOWER(${col}) = LOWER(${param})`;
        if (c.op === '!=')
          return `LOWER(${col}) <> LOWER(${param})`;
  
        return `${col} ${c.op} ${param}`;   // >  <
      });
  
      const sql = `
        SELECT * FROM patient_info
         WHERE ${clauses.join(' AND ')}
         ORDER BY id DESC;
      `;
  
      const params = where.map(c =>
        c.op === 'LIKE' ? `%${c.val}%` : c.val
      );
  
      const res = await db.query(sql, params);
  
      if (res.rows.length) {
        
        const gridCols: GridColDef[] = Object.keys(res.rows[0]).map(k => ({
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
      } else {
        setRows([]);
      }
    };
  
   
    return (
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Patient Query Builder
          </Typography>
  
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Field"
                value={cond.field}
                onChange={e =>
                  setCond({ ...cond, field: e.target.value as Field })
                }
              >
                {fields.map(f => (
                  <MenuItem key={f.value} value={f.value}>
                    {f.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
  
            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                label="Operator"
                value={cond.op}
                onChange={e => setCond({ ...cond, op: e.target.value })}
              >
                {ops.map(o => (
                  <MenuItem key={o.value} value={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
  
            <Grid item xs={12} sm={3}>
              <TextField
                label="Value"
                fullWidth
                value={cond.val}
                onChange={e => setCond({ ...cond, val: e.target.value })}
              />
            </Grid>
  
            <Grid item xs={12} sm={2}>
              <Button onClick={handleAdd} fullWidth variant="contained">
                Add
              </Button>
            </Grid>
          </Grid>
  
          
          {!!where.length && (
            <Stack direction="row" spacing={1} sx={{ my: 2, flexWrap: 'wrap' }}>
              {where.map((c, i) => (
                <Chip
                  key={i}
                  label={`${c.field} ${c.op} ${c.val}`}
                  onDelete={() => handleDelete(i)}
                />
              ))}
            </Stack>
          )}
  
          
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Button
              variant="contained"
              onClick={run}
              disabled={!where.length}
            >
              Run query
            </Button>
            <Button
              onClick={() => {
                setWhere([]);
                setRows([]);
              }}
            >
              Clear
            </Button>
          </Stack>
  
          
          {rows.length ? (
            <Box sx={{ height: 420 }}>
              <DataGrid
                rows={rows}
                columns={cols}
                getRowId={r => r.id}
                density="compact"
                pageSizeOptions={[10, 25, 50]}
              />
            </Box>
          ) : (
            <Typography variant="body2">
              {where.length ? 'No rows match.' : 'Build a WHERE clause above…'}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  }
  