"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, AlertTriangle, Target, X } from "lucide-react";
import { dismissRecommendation } from "@/app/actions/health";
import { MoneyDisplay } from "@/components/ui/MoneyDisplay";

interface HealthScoreData {
  score: number;
  classification: "Saudável" | "Atenção" | "Risco";
  breakdown: { spending: number; growth: number; commitments: number; goals: number };
}
interface ProjectionData {
  currentBalance: number;
  projectedBalance30d: number;
  daysUntilZero: number | null;
  message: string;
  projectionPoints: Array<{ day: number; balance: number }>;
}
interface BalanceData { current: number; lastMonth: number; change: number }
interface BurnRateData { last30Days: number; previous30Days: number; changePercent: number }
interface Recommendation { id: string; type: string; message: string; score: number; createdAt: Date }
interface MemberContribution { id: string; name: string; amount: number; percent: number }
interface SaudePageClientProps {
  healthScore: HealthScoreData | null;
  projection: ProjectionData | null;
  balance: BalanceData;
  burnRate: BurnRateData;
  recommendations: Recommendation[];
  memberContributions: MemberContribution[];
  userRole: string;
}

function getScoreAccent(c: string) {
  if (c === "Saudável") return { ring: "var(--positive)", badge: "bg-positive/10 text-positive" };
  if (c === "Atenção")  return { ring: "var(--warning)", badge: "bg-warning/10 text-warning" };
  if (c === "Risco")    return { ring: "var(--negative)", badge: "bg-negative/10 text-negative" };
  return { ring: "var(--secondary)", badge: "bg-secondary/10 text-secondary" };
}

function HealthScoreRing({ score, classification }: { score: number; classification: string }) {
  const { ring } = getScoreAccent(classification);
  const radius = 80, strokeW = 8;
  const nr = radius - strokeW / 2;
  const circ = 2 * Math.PI * nr;
  const targetOffset = circ - (score / 100) * circ;
  const [offset, setOffset] = useState(circ);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / 800, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setOffset(circ - e * (circ - targetOffset));
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  return (
    <svg width={radius * 2} height={radius * 2} className="rotate-[-90deg]">
      <circle cx={radius} cy={radius} r={nr} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeW} />
      <circle cx={radius} cy={radius} r={nr} fill="none" stroke={ring} strokeWidth={strokeW}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
  );
}

function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-[11px] text-secondary">{label}</span>
        <span className="text-[11px] font-semibold tabular-nums text-foreground">
          {value.toFixed(value % 1 === 0 ? 0 : 1)}/{max}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function ECard({ children, className = "", span }: {
  children: React.ReactNode; className?: string; span?: string;
}) {
  return (
    <div className={[
      "bg-surface border border-white/10 rounded-[16px] px-6 py-5 shadow-sm hover:border-primary/20 hover:shadow-[0_0_15px_rgba(25,255,99,0.05)] transition-all duration-300",
      span ?? "", className,
    ].join(" ")}>
      {children}
    </div>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-secondary mb-3">
      {children}
    </p>
  );
}

function ProjectionChart({ points }: { points: Array<{ day: number; balance: number }> }) {
  if (!points.length) return null;
  const max = Math.max(...points.map(p => p.balance));
  const min = Math.min(...points.map(p => p.balance));
  const range = max - min || 1;
  return (
    <div className="flex items-end gap-[2px] h-12 mt-3">
      {points.map((p, i) => {
        const h = Math.max(((p.balance - min) / range) * 100, 4);
        return (
          <div key={i} className="flex-1 rounded-t"
            style={{ height: `${h}%`,
              backgroundColor: p.balance >= 0 ? "var(--positive)" : "var(--negative)", opacity: 0.65 }} />
        );
      })}
    </div>
  );
}

export default function SaudePageClient({
  healthScore, projection, balance, burnRate,
  recommendations: initialRecommendations, memberContributions, userRole,
}: SaudePageClientProps) {
  const [recommendations, setRecommendations] = useState(initialRecommendations);

  const handleDismiss = async (id: string) => {
    try {
      await dismissRecommendation(id);
      setRecommendations(recommendations.filter(r => r.id !== id));
      toast.success("Alerta dispensado");
    } catch { toast.error("Erro ao dispensar alerta"); }
  };

  const scoreAccent = healthScore ? getScoreAccent(healthScore.classification) : null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Saúde Financeira</h1>
        <p className="text-secondary mt-1 text-sm">Diagnóstico completo da saúde financeira familiar.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        {healthScore && scoreAccent && (
          <ECard span="md:col-span-2 lg:col-span-3">
            <CardLabel>Score de Saúde Financeira</CardLabel>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 160, height: 160 }}>
                <HealthScoreRing score={healthScore.score} classification={healthScore.classification} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-black leading-none" style={{
                    fontSize: "72px",
                    fontFeatureSettings: '"tnum"',
                    color: scoreAccent.ring,
                    fontFamily: "var(--font-geist-sans), var(--font-inter), sans-serif",
                  }}>
                    {healthScore.score}
                  </span>
                  <span className={`mt-1.5 text-xs font-semibold px-3 py-1 rounded-full ${scoreAccent.badge}`}>
                    {healthScore.classification}
                  </span>
                </div>
              </div>
              <div className="flex-1 w-full space-y-3">
                <MiniBar label="Controle de gastos" value={healthScore.breakdown.spending} max={40} color="var(--positive)" />
                <MiniBar label="Crescimento de saldo" value={healthScore.breakdown.growth} max={30} color="var(--positive)" />
                <MiniBar label="Compromissos fixos" value={healthScore.breakdown.commitments} max={20} color="var(--warning)" />
                <MiniBar label="Progresso em metas" value={healthScore.breakdown.goals} max={10} color="var(--warning)" />
              </div>
            </div>
          </ECard>
        )}

        <ECard>
          <CardLabel>Saldo Consolidado</CardLabel>
          <MoneyDisplay amount={balance.current} size="lg" />
          <div className="flex items-center gap-1.5 mt-3 text-xs">
            {balance.change >= 0 ? (
              <><TrendingUp size={12} className="text-positive" />
              <MoneyDisplay amount={balance.change} size="sm" delta className="text-positive" /></>
            ) : (
              <><TrendingDown size={12} className="text-negative" />
              <MoneyDisplay amount={balance.change} size="sm" delta className="text-negative" /></>
            )}
            <span className="text-secondary">vs. mês anterior</span>
          </div>
        </ECard>

        <ECard>
          <CardLabel>Burn Rate</CardLabel>
          <MoneyDisplay amount={burnRate.last30Days} size="lg" />
          <p className="text-secondary text-xs mt-1 mb-3">Últimos 30 dias</p>
          <div className="flex items-center gap-1.5 text-xs">
            {burnRate.changePercent > 0 ? (
              <><TrendingUp size={12} className="text-negative" />
              <span className="font-semibold text-negative">+{burnRate.changePercent.toFixed(1)}%</span></>
            ) : burnRate.changePercent < 0 ? (
              <><TrendingDown size={12} className="text-positive" />
              <span className="font-semibold text-positive">{burnRate.changePercent.toFixed(1)}%</span></>
            ) : (
              <span className="text-secondary">Sem variação</span>
            )}
          </div>
        </ECard>

        {projection && (
          <ECard>
            <CardLabel>Projeção de Caixa</CardLabel>
            <MoneyDisplay amount={projection.projectedBalance30d} size="lg" semantic />
            <p className="text-secondary text-xs mt-1 mb-2">Em 30 dias</p>
            <p className="text-xs text-white/60 leading-relaxed">{projection.message}</p>
            <ProjectionChart points={projection.projectionPoints} />
          </ECard>
        )}

        {recommendations.length > 0 && (
          <ECard span="md:col-span-2 lg:col-span-3">
            <CardLabel>
              Alertas Ativos · {recommendations.length}{" "}
              {recommendations.length === 1 ? "recomendação" : "recomendações"}
            </CardLabel>
            <div className="space-y-2">
              {recommendations.map((rec) => (
                <div key={rec.id} className="flex items-start gap-3 p-3 rounded-[8px] border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <div className="mt-0.5 flex-shrink-0">
                    {rec.type === "ALERT" && <AlertTriangle size={14} className="text-negative" />}
                    {rec.type === "WARNING" && <AlertTriangle size={14} className="text-warning" />}
                    {rec.type === "SUGGESTION" && <Target size={14} className="text-secondary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-relaxed">{rec.message}</p>
                    <p className="text-xs text-secondary mt-1">{new Date(rec.createdAt).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <button onClick={() => handleDismiss(rec.id)} className="p-1 rounded hover:bg-white/5 transition-colors flex-shrink-0" title="Dispensar">
                    <X size={13} className="text-secondary" />
                  </button>
                </div>
              ))}
            </div>
          </ECard>
        )}

        {userRole !== "VIEWER" && memberContributions.length > 0 && (
          <ECard span="md:col-span-2 lg:col-span-3">
            <CardLabel>Contribuição por Membro</CardLabel>
            <div className="space-y-4">
              {memberContributions.map((member) => (
                <div key={member.id}>
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-secondary flex-shrink-0">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-foreground">{member.name}</span>
                        <span className="text-xs text-secondary tabular-nums">
                          <MoneyDisplay amount={member.amount} size="sm" /> ({member.percent}%)
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${member.percent}%`, backgroundColor: "var(--positive)" }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ECard>
        )}

      </div>
    </div>
  );
}
