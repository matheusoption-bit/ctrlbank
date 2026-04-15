"use client";

import React, { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, Loader, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Falha ao fazer login");
        setLoading(false);
        return;
      }

      setSuccess("Login realizado com sucesso! Redirecionando...");
      setTimeout(() => {
        router.push(redirectUrl);
        router.refresh();
      }, 1500);
    } catch {
      setError("Erro ao conectar ao servidor");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5 py-8">
      <motion.div
        className="w-full max-w-sm"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div className="text-center mb-10" variants={itemVariants}>
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-primary">Ctrl</span>
            <span className="text-foreground">Bank</span>
          </h1>
          <p className="text-secondary text-sm mt-2">Premium Banking Experience</p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="card-c6 space-y-6"
          variants={itemVariants}
        >
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Bem-vindo de volta</h2>
            <p className="text-secondary text-sm">
              Acesse sua conta para gerenciar suas finanças
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="bg-negative/10 border border-negative/30 rounded-xl p-3.5 flex items-center gap-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <AlertCircle className="w-4 h-4 text-negative flex-shrink-0" />
                <p className="text-sm text-negative">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                className="bg-positive/10 border border-positive/30 rounded-xl p-3.5 flex items-center gap-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <CheckCircle className="w-4 h-4 text-positive flex-shrink-0" />
                <p className="text-sm text-positive">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="section-label">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-secondary pointer-events-none" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-c6 pl-12"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="section-label">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-secondary pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-c6 pl-12"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
            </motion.div>

            {/* Login Button */}
            <motion.button
              type="submit"
              className="btn-primary flex items-center justify-center gap-2 mt-2"
              variants={itemVariants}
              disabled={loading}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <Loader className="w-4.5 h-4.5 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <LogIn className="w-4.5 h-4.5" />
                  Fazer Login
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-surface text-secondary">ou</span>
            </div>
          </div>

          {/* Register Link */}
          <motion.div className="text-center" variants={itemVariants}>
            <p className="text-secondary text-sm">
              Não tem uma conta?{" "}
              <Link
                href="/register"
                className="text-primary font-semibold hover:opacity-80 transition-opacity inline-flex items-center gap-1"
              >
                Criar conta
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-secondary/60 text-xs mt-8"
          variants={itemVariants}
        >
          © 2024 CtrlBank. Todos os direitos reservados.
        </motion.p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
