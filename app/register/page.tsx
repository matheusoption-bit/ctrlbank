"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Falha ao criar conta");
        return;
      }

      setSuccess("Conta criada com sucesso! Redirecionando...");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 2000);
    } catch (err) {
      setError("Erro ao conectar ao servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <motion.div className="text-center mb-12 relative z-10" variants={itemVariants}>
          <h1 className="text-5xl font-black tracking-tighter">
            <span className="text-primary">Ctrl</span>
            <span className="text-foreground">Bank</span>
          </h1>
          <p className="text-secondary text-sm mt-3 font-medium">Premium Banking Experience</p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="card-c6 space-y-6 relative z-10 bg-gradient-to-br from-surface to-black"
          variants={itemVariants}
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-black">Criar conta</h2>
            <p className="text-secondary text-sm font-medium">
              Junte-se ao CtrlBank e comece a gerenciar suas finanças
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              className="bg-danger/10 border border-danger/30 rounded-lg p-4 flex items-gap-3"
              variants={itemVariants}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
              <p className="text-sm text-danger font-medium">{error}</p>
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              className="bg-success/10 border border-success/30 rounded-lg p-4 flex items-gap-3"
              variants={itemVariants}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <p className="text-sm text-success font-medium">{success}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" />
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-c6 pl-12 font-medium"
                  required
                  disabled={loading}
                  autoComplete="name"
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-c6 pl-12 font-medium"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-c6 pl-12 font-medium"
                  required
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>
            </motion.div>

            {/* Confirm Password */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-c6 pl-12 font-medium"
                  required
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>
            </motion.div>

            {/* Register Button */}
            <motion.button
              type="submit"
              className="btn-primary flex items-center justify-center gap-2 mt-8 group"
              variants={itemVariants}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Criando conta...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  Criar Conta
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-secondary font-medium">ou</span>
            </div>
          </div>

          {/* Login Link */}
          <motion.div className="text-center" variants={itemVariants}>
            <p className="text-secondary text-sm">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="text-primary font-bold hover:opacity-80 transition-opacity inline-flex items-center gap-1"
              >
                Fazer login
                <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-secondary text-xs mt-8 relative z-10"
          variants={itemVariants}
        >
          © 2024 CtrlBank. Todos os direitos reservados.
        </motion.p>
      </motion.div>
    </div>
  );
}
