import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link,
  Alert,
  CircularProgress,
  Fade,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../api/auth';
import zocoLogo from '../../assets/zoco-logo.png';
import SplashScreen from '../../components/common/SplashScreen';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

function Login() {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showSplashBeforeDashboard, setShowSplashBeforeDashboard] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (showSplashBeforeDashboard) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 2000); // Duración del SplashScreen antes de navegar al dashboard

      return () => clearTimeout(timer);
    }
  }, [showSplashBeforeDashboard, navigate]);

  const onSubmit = async (data) => {
    try {
      setError('');
      setSubmitting(true);
      const response = await authAPI.login(data.email, data.password);

      if (response.success) {
        await login(data.email, data.password);
        setShowSplashBeforeDashboard(true); // Mostrar SplashScreen antes de navegar
      } else {
        setError(response.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <Container maxWidth="xs">
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (showSplashBeforeDashboard) {
    return <SplashScreen />; // Mostrar SplashScreen sin callback ya que la navegación se maneja con el useEffect
  }

  return (
    <Fade in timeout={600}>
      <Container maxWidth="xs" component="main">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            src={zocoLogo}
            alt="Zoco Logo"
            sx={{ width: 80, mb: 2 }}
          />

          <Typography component="h1" variant="h5" gutterBottom>
            Sign in to your account
          </Typography>

          <Paper elevation={3} sx={{ mt: 3, p: 4, width: '100%' }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={submitting}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={submitting}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={!isValid || submitting}
              >
                {submitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>

              <Box textAlign="center">
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                  sx={{ textDecoration: 'none' }}
                >
                  Forgot password?
                </Link>
              </Box>
            </Box>
          </Paper>

          <Box mt={3} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link
                component={RouterLink}
                to="/register"
                sx={{ fontWeight: 500 }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Fade>
  );
}

export default Login;