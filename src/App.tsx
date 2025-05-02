import { Container, CssBaseline, Typography, Tabs, Tab, Box } from '@mui/material';
import PatientForm from './components/PatientForm';
import { useState } from 'react';

export default function App() {
  const [tab, setTab] = useState(0);
  return (
    <>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          🩺 PGlite Patient Registry
        </Typography>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 3 }}>
          <Tab label="Register" />
          <Tab label="Patients" />
          <Tab label="SQL Console" />
        </Tabs>

        {tab === 0 && <PatientForm />}
      </Container>
    </>
  );
}
