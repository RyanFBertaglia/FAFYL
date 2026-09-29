import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Background from '@/components/layout/background';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Register() {
  const navigate = useNavigate();
  const { token, isLoading, signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && token) {
      navigate('/home', { replace: true });
    }
  }, [isLoading, token, navigate]);

  const handleRegister = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setError('Informe seu nome.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Informe um e-mail válido.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter ao menos 6 caracteres.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await signUp({ name: cleanName, email: cleanEmail, password });
      navigate('/home', { replace: true });
    } catch {
      setError('Não foi possível cadastrar. Verifique se o e-mail já está em uso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <PageTransition>
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            className="w-full max-w-md"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardHeader className="text-center">
                <motion.h1
                  className="text-3xl font-bold text-primary"
                  variants={fadeUp}
                >
                  FAFYL
                </motion.h1>
                <motion.div variants={fadeUp}>
                  <CardDescription>Crie sua conta</CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'name', label: 'Nome', type: 'text', placeholder: 'Seu nome', autoComplete: 'name' },
                  { key: 'email', label: 'E-mail', type: 'email', placeholder: 'seu@email.com', autoComplete: 'email' },
                  { key: 'password', label: 'Senha', type: 'password', placeholder: 'Sua senha', autoComplete: 'new-password' },
                  { key: 'cep', label: 'CEP', type: 'text', placeholder: '00000-000', autoComplete: 'postal-code' },
                ].map((field) => (
                  <motion.div key={field.key} className="space-y-2" variants={fadeUp}>
                    <label className="text-sm font-medium text-foreground">{field.label}</label>
                    <Input
                      placeholder={field.placeholder}
                      type={field.type}
                      autoComplete={field.autoComplete}
                      value={
                        field.key === 'name' ? name :
                        field.key === 'email' ? email :
                        field.key === 'password' ? password : cep
                      }
                      onChange={(e) => {
                        if (field.key === 'name') setName(e.target.value);
                        else if (field.key === 'email') setEmail(e.target.value);
                        else if (field.key === 'password') setPassword(e.target.value);
                        else setCep(e.target.value);
                      }}
                      disabled={loading}
                    />
                  </motion.div>
                ))}
                {error && (
                  <motion.p className="text-sm text-red-500 text-center" variants={fadeUp}>
                    {error}
                  </motion.p>
                )}
                <motion.div variants={fadeUp}>
                  <Button variant="accent" size="lg" className="w-full" onClick={handleRegister} disabled={loading}>
                    {loading ? 'Cadastrando…' : 'Cadastrar'}
                  </Button>
                </motion.div>
                <motion.div className="text-center" variants={fadeUp}>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-sm text-muted-foreground hover:text-foreground cursor-pointer bg-transparent border-none"
                  >
                    Já possui uma conta?{' '}
                    <span className="font-semibold text-primary">Fazer login</span>
                  </button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </PageTransition>
    </Background>
  );
}