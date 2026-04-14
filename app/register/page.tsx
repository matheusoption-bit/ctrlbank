"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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
        {/* Logo */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <h1 className="text-4xl font-bold tracking-tighter">
            <span className="text-primary">Ctrl</span>Bank
          </h1>
          <p className="text-secondary text-sm mt-2">Premium Banking Experience</p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="card-c6 space-y-6"
          variants={itemVariants}
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Criar conta</h2>
            <p className="text-secondary text-sm">
              Junte-se ao CtrlBank e comece a gerenciar suas finanças
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              className="bg-danger/10 border border-danger/30 rounded-lg p-3 flex items-gap-3"
              variants={itemVariants}
            >
              <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
              <p className="text-sm text-danger">{error}</p>
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              className="bg-success/10 border border-success/30 rounded-lg p-3 flex items-gap-3"
              variants={itemVariants}
            >
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <p className="text-sm text-success">{success}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="text-sm font-medium text-foreground">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" />
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-c6 pl-12"
                  required
                  disabled={loading}
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-c6 pl-12"
                  required
                  disabled={loading}
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="text-sm font-medium text-foreground">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-c6 pl-12"
                  required
                  disabled={loading}
                />
              </div>
            </motion.div>

            {/* Confirm Password */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="text-sm font-medium text-foreground">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-c6 pl-12"
                  required
                  disabled={loading}
                />
              </div>
            </motion.div>

            {/* Register Button */}
            <motion.button
              type="submit"
              className="btn-primary flex items-center justify-center gap-2 mt-6"
              variants={itemVariants}
              disabled={loading}
            >
              <UserPlus className="w-4 h-4" />
              {loading ? "Criando conta..." : "Criar Conta"}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-secondary">ou</span>
            </div>
          </div>

          {/* Login Link */}
          <motion.div className="text-center" variants={itemVariants}>
            <p className="text-secondary text-sm">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:opacity-80 transition-opacity"
              >
                Fazer login
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-secondary text-xs mt-8"
          variants={itemVariants}
        >
          © 2024 CtrlBank. Todos os direitos reservados.
        </motion.p>
      </motion.div>
    </div>
  );
}
