"use client";

import { motion } from "framer-motion";
import { UserCircle, Mail, Shield, LogOut } from "lucide-react";
import { handleLogout } from "@/lib/actions/auth.actions";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function PerfilPage() {
  return (
    <motion.div
      className="space-y-6 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-black tracking-tighter">Meu Perfil</h1>
        <p className="text-secondary mt-1 text-sm">Gerencie sua conta e preferências</p>
      </motion.div>

      {/* Avatar */}
      <motion.div
        variants={itemVariants}
        className="card-c6 flex flex-col items-center text-center space-y-4"
      >
        <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
          <UserCircle className="w-14 h-14 text-primary" />
        </div>
        <div>
          <p className="text-xl font-bold">Usuário</p>
          <p className="text-secondary text-sm">Membro desde 2024</p>
        </div>
      </motion.div>

      {/* Info Cards */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="card-c6-sm flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-secondary font-medium uppercase tracking-wide">Email</p>
            <p className="font-semibold text-sm">—</p>
          </div>
        </div>

        <div className="card-c6-sm flex items-center gap-4">
          <div className="p-2 bg-success/10 rounded-xl">
            <Shield className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-xs text-secondary font-medium uppercase tracking-wide">Segurança</p>
            <p className="font-semibold text-sm">Conta protegida</p>
          </div>
        </div>
      </motion.div>

      {/* Logout */}
      <motion.div variants={itemVariants}>
        <form action={handleLogout}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 btn-outline text-danger border-danger/30 hover:bg-danger/10 hover:border-danger"
          >
            <LogOut className="w-5 h-5" />
            Sair da Conta
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
