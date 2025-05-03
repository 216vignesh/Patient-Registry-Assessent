import { Container, CssBaseline, Typography, Tabs, Tab} from '@mui/material';
import PatientForm from './components/PatientForm';
import PatientTable from './components/PatientTable';
import SqlConsole from './components/SqlConsole';
import PatientQuery from './components/PatientQuery';

import { useState } from 'react';

export default function App() {
  const [tab, setTab] = useState(0);
  return (
    <>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          🩺 Patient Registration System
        </Typography>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 3 }}>
          <Tab label="Register" />
          <Tab label="Patients" />
          <Tab label="Filter users" />
          <Tab label="SQL Console" />
        </Tabs>

        {tab === 0 && <PatientForm />}
        {tab === 1 && <PatientTable />}
        {tab === 2 && <PatientQuery />}
        {tab === 3 && <SqlConsole />}
      </Container>
    </>
  );
}
