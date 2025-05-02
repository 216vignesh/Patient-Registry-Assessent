// src/components/PatientForm.tsx
import {
    Box,
    Button,
    Grid,
    MenuItem,
    Snackbar,
    TextField
  } from '@mui/material';
  import { useState } from 'react';
  import { db } from '../lib/db';
  import { notifyMutation } from '../lib/broadcast';
  
  const nameRe = /^[\p{L} .'-]+$/u;               
  const emailRe =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;                
  const phoneRe =
    /^(?:\+?[1-9]\d{1,14}|[(]?\d{3}[)]?\s?\d{3}[-\s]?\d{4})$/; 
  
  function isPast(dateStr: string) {
    return !dateStr || new Date(dateStr) < new Date();
  }
  
  export default function PatientForm() {
    const [values, setValues] = useState({
      first_name: '',
      last_name: '',
      dob: '',
      gender: '',
      phone: '',
      email: ''
    });
  
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [open, setOpen] = useState(false);
  

    const handleChange =
      (field: keyof typeof values) =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        setValues({ ...values, [field]: e.target.value });
  

    function validate() {
      const err: Record<string, string> = {};
  
      if (!nameRe.test(values.first_name)) err.first_name = 'Invalid name';
      if (!nameRe.test(values.last_name)) err.last_name = 'Invalid name';
  
      if (!isPast(values.dob)) err.dob = 'Date must be in the past';
  
      if (values.email && !emailRe.test(values.email))
        err.email = 'Invalid email';
  
      if (values.phone && !phoneRe.test(values.phone))
        err.phone = 'Invalid phone';
  
      setErrors(err);
      return Object.keys(err).length === 0;
    }
  

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!validate()) return;
  
      await db.query(
        'insert into patient_info (first_name,last_name,dob,gender,phone,email) values ($1,$2,$3,$4,$5,$6)',
        [
          values.first_name.trim(),
          values.last_name.trim(),
          values.dob || null,
          values.gender || null,
          values.phone || null,
          values.email || null
        ]
      );
      notifyMutation();
      setValues({
        first_name: '',
        last_name: '',
        dob: '',
        gender: '',
        phone: '',
        email: ''
      });
      setOpen(true);
    }
  
   
    return (
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="First name"
              fullWidth
              value={values.first_name}
              onChange={handleChange('first_name')}
              error={!!errors.first_name}
              helperText={errors.first_name}
            />
          </Grid>
  
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Last name"
              fullWidth
              value={values.last_name}
              onChange={handleChange('last_name')}
              error={!!errors.last_name}
              helperText={errors.last_name}
            />
          </Grid>
  
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of birth"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={values.dob}
              onChange={handleChange('dob')}
              error={!!errors.dob}
              helperText={errors.dob}
            />
          </Grid>
  
          <Grid item xs={12} sm={3}>
            <TextField
              label="Gender"
              select
              fullWidth
              value={values.gender}
              onChange={handleChange('gender')}
            >
              <MenuItem value="">–</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>
  
          <Grid item xs={12} sm={3}>
            <TextField
              label="Phone"
              fullWidth
              value={values.phone}
              onChange={handleChange('phone')}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>
  
          <Grid item xs={12}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={values.email}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
  
          <Grid item xs={12}>
            <Button variant="contained" type="submit">
              Register
            </Button>
          </Grid>
        </Grid>
  
        <Snackbar
          open={open}
          autoHideDuration={2500}
          onClose={() => setOpen(false)}
          message="Patient registered"
        />
      </Box>
    );
  }
  