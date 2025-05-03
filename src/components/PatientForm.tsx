import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { db } from '../lib/db';
import { notifyMutation } from '../lib/broadcast';

const nameRe   = /^[\p{L} .'-]+$/u;
const phoneRe  =
  /^(?:\+?[1-9]\d{1,14}|[(]?\d{3}[)]?\s?\d{3}[-\s]?\d{4})$/;
const emailRe  = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const zipRe    = /^\d{6}$/;

const isPast = (d: string) => !d || new Date(d) < new Date();

export default function PatientForm() {
  const [values, set] = useState({
    first_name: '', last_name: '', dob: '', gender: '',
    phone: '', email: '',
    address: '', city: '', state: '', zip: '',
    insurance_company: '', insurance_number: '',
    emergency_name: '', emergency_phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snack, setSnack] = useState(false);

  const on = (f: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement>) => set({ ...values, [f]: e.target.value });

  function validate() {
    const e: Record<string, string> = {};
    if (!nameRe.test(values.first_name)) e.first_name = 'Invalid';
    if (!nameRe.test(values.last_name))  e.last_name  = 'Invalid';
    if (!isPast(values.dob))             e.dob        = 'Must be past';
    if (values.phone && !phoneRe.test(values.phone)) e.phone = 'Invalid';
    if (values.email && !emailRe.test(values.email)) e.email = 'Invalid';
    if (values.zip   && !zipRe.test(values.zip))     e.zip   = '5 digits';
    if (values.emergency_phone && !phoneRe.test(values.emergency_phone))
      e.emergency_phone = 'Invalid';
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    await db.query(
      `insert into patient_info
         (first_name,last_name,dob,gender,phone,email,
          address,city,state,zip,
          insurance_company,insurance_number,
          emergency_name,emergency_phone)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [
        values.first_name.trim(), values.last_name.trim(), values.dob || null,
        values.gender || null,    values.phone || null,   values.email || null,
        values.address,           values.city,            values.state,
        values.zip,               values.insurance_company,
        values.insurance_number,  values.emergency_name,
        values.emergency_phone
      ]
    );
    notifyMutation();
    set({
      first_name:'',last_name:'',dob:'',gender:'',
      phone:'',email:'',address:'',city:'',state:'',zip:'',
      insurance_company:'',insurance_number:'',
      emergency_name:'',emergency_phone:''
    });
    setSnack(true);
  }

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Patient Registration
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField required label="First name" fullWidth
                  value={values.first_name} onChange={on('first_name')}
                  error={!!errors.first_name} helperText={errors.first_name} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required label="Last name" fullWidth
                  value={values.last_name} onChange={on('last_name')}
                  error={!!errors.last_name} helperText={errors.last_name}/>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Date of birth" type="date" fullWidth
                  InputLabelProps={{ shrink:true }}
                  value={values.dob} onChange={on('dob')}
                  error={!!errors.dob} helperText={errors.dob}/>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField label="Gender" select fullWidth value={values.gender}
                  onChange={on('gender')}>
                  <MenuItem value="">–</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField label="Phone" fullWidth
                  value={values.phone} onChange={on('phone')}
                  error={!!errors.phone} helperText={errors.phone}/>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField label="Email" type="email" fullWidth
                  value={values.email} onChange={on('email')}
                  error={!!errors.email} helperText={errors.email}/>
              </Grid>
            </Grid>

            
            <Typography variant="subtitle1">Address</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Street address" fullWidth value={values.address}
                  onChange={on('address')} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="City" fullWidth value={values.city}
                  onChange={on('city')} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField label="State" fullWidth value={values.state}
                  onChange={on('state')} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField label="ZIP" fullWidth value={values.zip}
                  onChange={on('zip')} error={!!errors.zip} helperText={errors.zip}/>
              </Grid>
            </Grid>

            
            <Typography variant="subtitle1">Insurance</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Company" fullWidth value={values.insurance_company}
                  onChange={on('insurance_company')}/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Number" fullWidth value={values.insurance_number}
                  onChange={on('insurance_number')}/>
              </Grid>
            </Grid>

            
            <Typography variant="subtitle1">Emergency Contact</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Name" fullWidth value={values.emergency_name}
                  onChange={on('emergency_name')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Phone" fullWidth value={values.emergency_phone}
                  onChange={on('emergency_phone')}
                  error={!!errors.emergency_phone} helperText={errors.emergency_phone}/>
              </Grid>
            </Grid>

            <Button variant="contained" type="submit" sx={{ alignSelf:'flex-start' }}>
              Register Patient
            </Button>
          </Stack>
        </Box>
      </CardContent>

      <Snackbar
        open={snack}
        autoHideDuration={2500}
        message="Patient registered"
        onClose={() => setSnack(false)}
      />
    </Card>
  );
}
