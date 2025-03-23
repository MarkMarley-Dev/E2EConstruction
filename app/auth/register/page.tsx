// src/app/auth/register/page.tsx
import { RegisterForm } from '../../components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account | Planning & Construction Platform',
  description: 'Sign up to start your planning and construction projects',
};

export default function RegisterPage() {
  return <RegisterForm />;
}