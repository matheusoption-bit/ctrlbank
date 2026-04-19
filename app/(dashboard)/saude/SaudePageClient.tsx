"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, AlertTriangle, Target, X, Activity, Flame } from "lucide-react";
import { dismissRecommendation } from "@/app/actions/health";
import { MoneyDisplay } from "@/components/ui/MoneyDisplay";

/* ── Types ────────────────────────────────────────────── */
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
interface FinanceInsights {
  totalMonth: number;
  topCategories: Array<{ category: string; amount: number }>;
  alert: { type: "warning"; message: string } | null;
  recommendation: { message: string; impact: number } | null;
  average: number;
}
interface SaudePageClientProps {
  healthScore: HealthScoreData | null;
  projection: ProjectionData | null;
  balance: BalanceData;
  burnRate: BurnRateData;
  recommendations: Recommendation[];
  memberContributions: MemberContribution[];
  userRole: string;
  financeInsights: FinanceInsights;
}

/* ── Helpers ──────────────────────────────────────────── */
function getScoreAccent(c: string) {
  if (c === "Saudável") return { color: "var(--positive)", bg: "bg-positive/10", text: "text-positive", label: "Saudável" };
  if (c === "Atenção")  return { color: "var(--warning)",  bg: "bg-warning/10",  text: "text-warning",  label: "Atenção" };
  if (c === "Risco")    return { color: "var(--negative)", bg: "bg-negative/10", text: "text-negative", label: "Risco" };
  return { color: "var(--secondary)", bg: "bg-secondary/10", text: "text-secondary", label: "—" };
}

/* ── Score Ring (SVG) ─────────────────────────────────── */
function ScoreRing({ score, classification }: { score: number; classification: string }) {
  const accent = getScoreAccent(classification);
  const R = 72, W = 6;
  const r = R - W / 2;
  const circ = 2 * Math.PI * r;
  const target = circ - (score / 100) * circ;
  const [offset, setOffset] = useState(circ);
  const raf = useRef<number | null>(null);
  const t0 = useRef<number | null>(null);

  useEffect(() => {
    t0.current = null;
    const step = (ts: number) => {
      if (!t0.current) t0.current = ts;
      const p = Math.min((ts - t0.current) / 900, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setOffset(circ - e * (circ - target));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: R * 2, height: R * 2 }}>
      <svg width={R * 2} height={R * 2} className="rotate-[-90deg]">
        <circle cx={R} cy={R} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={W} />
        <circle cx={R} cy={R} r={r} fill="none" stroke={accent.color} strokeWidth={W}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${accent.color}40)` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-black tabular-nums leading-none"
          style={{ fontSize: "56px", color: accent.color, fontFamily: "var(--font-geist-sans), var(--font-inter), sans-serif" }}>
          {score}
        </span>
        <span className={`mt-2 text-[10px] font-bold uppercase tracking-[0.12em] px-3 py-0.5 rounded-full ${accent.bg} ${accent.text}`}>
          {accent.label}
        </span>
      </div>
    </div>
  );
}

/* ── Breakdown Bar ────────────────────────────────────── */
function BreakdownBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-[11px] text-[#666]">{label}</span>
        <span className="text-[11px] font-semibold tabular-nums text-foreground">
          {value.toFixed(value % 1 === 0 ? 0 : 1)}<span className="text-[#444]">/{max}</span>
        </span>
      </div>
      <div className="h-[5px] rounded-full bg-white/[0.04] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

/* ── Spark Chart ──────────────────────────────────────── */
function SparkChart({ points }: { points: Array<{ day: number; balance: number }> }) {
  if (!points.length) return null;
  const max = Math.max(...points.map(p => p.balance));
  const min = Math.min(...points.map(p => p.balance));
  const range = max - min || 1;
  return (
    <div className="flex items-end gap-[2px] h-10 mt-4">
      {points.map((p, i) => {
        const h = Math.max(((p.balance - min) / range) * 100, 6);
        return (
          <div key={i} className="flex-1 rounded-sm transition-all duration-300"
            style={{
              height: `${h}%`,
              backgroundColor: p.balance >= 0 ? "var(--positive)" : "var(--negative)",
              opacity: 0.5 + (i / points.length) * 0.5,
            }} />
        );
      })}
    </div>
  );
}

/* ── Generic Card ─────────────────────────────────────── */
function Card({ children, className = "", span }: {
  children: React.ReactNode; className?: string; span?: string;
}) {
  return (
    <div className={[
      "bg-[#0a0a0a] border border-white/[0.06] rounded-2xl px-6 py-5",
      "transition-all duration-300 hover:border-white/[0.10]",
      span ?? "", className,
    ].join(" ")}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#555] mb-3">
      {children}
    </p>
  );
}

/* ── Main Component ───────────────────────────────────── */
export default function SaudePageClient({
  healthScore, projection, balance, burnRate,
  recommendations: initialRecommendations, memberContributions, userRole, financeInsights,
}: SaudePageClientProps) {
  const [recommendations, setRecommendations] = useState(initialRecommendations);

  const handleDismiss = async (id: string) => {
    try {
      await dismissRecommendation(id);
      setRecommendations(recommendations.filter(r => r.id !== id));
      toast.success("Alerta dispensado");
    } catch { toast.error("Erro ao dispensar alerta"); }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Page Header ─────────────────────────────────── */}
      <header className="space-y-1">
        <h1 className="text-2xl font-black tracking-[-0.03em] text-foreground">
          Saúde Financeira
        </h1>
        <p className="text-[13px] text-[#555]">
          Diagnóstico completo da saúde financeira familiar.
        </p>
      </header>

      <Card span="w-full">
        <Label>Resumo Inteligente do Mês</Label>
        <div className="space-y-2 text-sm">
          <p>
            Total gasto no mês: <span className="font-bold"><MoneyDisplay amount={financeInsights.totalMonth} size="sm" /></span>
          </p>
          <p className="text-[11px] text-[#666]">
            Média recente: <MoneyDisplay amount={financeInsights.average} size="sm" />
          </p>
          <div>
            <p className="text-xs font-semibold mb-1">Top 3 categorias</p>
            <ul className="space-y-1 text-xs text-[#b3b3b3]">
              {financeInsights.topCategories.map((item) => (
                <li key={item.category} className="flex justify-between">
                  <span>{item.category}</span>
                  <span className="tabular-nums">R$ {item.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
          {financeInsights.alert && (
            <p className="text-warning text-xs inline-flex items-center gap-1">
              <AlertTriangle size={12} /> {financeInsights.alert.message}
            </p>
          )}
          {financeInsights.recommendation && (
            <p className="text-info text-xs">
              Recomendação: {financeInsights.recommendation.message}
            </p>
          )}
        </div>
      </Card>

      {/* ── Hero: Score ──────────────────────────────────── */}
      {healthScore && (
        <Card span="w-full" className="!py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            <ScoreRing score={healthScore.score} classification={healthScore.classification} />
            <div className="flex-1 w-full space-y-4">
              <div>
                <Label>Composição do Score</Label>
              </div>
              <BreakdownBar label="Controle de gastos" value={healthScore.breakdown.spending} max={40} color="var(--positive)" />
              <BreakdownBar label="Crescimento de saldo" value={healthScore.breakdown.growth} max={30} color="var(--positive)" />
              <BreakdownBar label="Compromissos fixos" value={healthScore.breakdown.commitments} max={20} color="var(--warning)" />
              <BreakdownBar label="Progresso em metas" value={healthScore.breakdown.goals} max={10} color="var(--warning)" />
            </div>
          </div>
        </Card>
      )}

      {/* ── Metrics Grid ─────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Saldo Consolidado */}
        <Card>
          <Label>Saldo Consolidado</Label>
          <MoneyDisplay amount={balance.current} size="lg" />
          <div className="flex items-center gap-1.5 mt-3">
            {balance.change >= 0 ? (
              <>
                <div className="w-5 h-5 rounded-full bg-positive/10 flex items-center justify-center">
                  <TrendingUp size={11} className="text-positive" />
                </div>
                <MoneyDisplay amount={balance.change} size="sm" delta className="text-positive" />
              </>
            ) : (
              <>
                <div className="w-5 h-5 rounded-full bg-negative/10 flex items-center justify-center">
                  <TrendingDown size={11} className="text-negative" />
                </div>
                <MoneyDisplay amount={balance.change} size="sm" delta className="text-negative" />
              </>
            )}
            <span className="text-[11px] text-[#555]">vs. mês anterior</span>
          </div>
        </Card>

        {/* Burn Rate */}
        <Card>
          <Label>
            <span className="inline-flex items-center gap-1.5">
              <Flame size={11} className="text-[#555]" />
              Burn Rate
            </span>
          </Label>
          <MoneyDisplay amount={burnRate.last30Days} size="lg" />
          <p className="text-[11px] text-[#444] mt-1 mb-3">Últimos 30 dias</p>
          <div className="flex items-center gap-1.5">
            {burnRate.changePercent > 0 ? (
              <>
                <div className="w-5 h-5 rounded-full bg-negative/10 flex items-center justify-center">
                  <TrendingUp size={11} className="text-negative" />
                </div>
                <span className="text-xs font-semibold text-negative tabular-nums">+{burnRate.changePercent.toFixed(1)}%</span>
              </>
            ) : burnRate.changePercent < 0 ? (
              <>
                <div className="w-5 h-5 rounded-full bg-positive/10 flex items-center justify-center">
                  <TrendingDown size={11} className="text-positive" />
                </div>
                <span className="text-xs font-semibold text-positive tabular-nums">{burnRate.changePercent.toFixed(1)}%</span>
              </>
            ) : (
              <span className="text-[11px] text-[#555]">Sem variação</span>
            )}
          </div>
        </Card>

        {/* Projeção de Caixa */}
        {projection && (
          <Card>
            <Label>
              <span className="inline-flex items-center gap-1.5">
                <Activity size={11} className="text-[#555]" />
                Projeção 30d
              </span>
            </Label>
            <MoneyDisplay amount={projection.projectedBalance30d} size="lg" semantic />
            <p className="text-[11px] text-[#444] mt-1 leading-relaxed line-clamp-2">{projection.message}</p>
            <SparkChart points={projection.projectionPoints} />
          </Card>
        )}
      </div>

      {/* ── Alerts ────────────────────────────────────────── */}
      {recommendations.length > 0 && (
        <Card>
          <Label>
            Alertas Ativos · {recommendations.length}
          </Label>
          <div className="space-y-1.5">
            {recommendations.map((rec) => (
              <div key={rec.id} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors group">
                <div className="mt-0.5 flex-shrink-0">
                  {rec.type === "ALERT" && (
                    <div className="w-6 h-6 rounded-full bg-negative/10 flex items-center justify-center">
                      <AlertTriangle size={12} className="text-negative" />
                    </div>
                  )}
                  {rec.type === "WARNING" && (
                    <div className="w-6 h-6 rounded-full bg-warning/10 flex items-center justify-center">
                      <AlertTriangle size={12} className="text-warning" />
                    </div>
                  )}
                  {rec.type === "SUGGESTION" && (
                    <div className="w-6 h-6 rounded-full bg-white/[0.04] flex items-center justify-center">
                      <Target size={12} className="text-[#666]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-foreground leading-relaxed">{rec.message}</p>
                  <p className="text-[10px] text-[#444] mt-1">{new Date(rec.createdAt).toLocaleDateString("pt-BR")}</p>
                </div>
                <button
                  onClick={() => handleDismiss(rec.id)}
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/5 transition-all flex-shrink-0"
                  title="Dispensar"
                >
                  <X size={12} className="text-[#555]" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Member Contributions ──────────────────────────── */}
      {userRole !== "VIEWER" && memberContributions.length > 0 && (
        <Card>
          <Label>Contribuição por Membro</Label>
          <div className="space-y-5">
            {memberContributions.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[11px] font-bold text-[#666] flex-shrink-0">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-[13px] font-medium text-foreground">{member.name}</span>
                    <span className="text-[11px] text-[#555] tabular-nums">
                      <MoneyDisplay amount={member.amount} size="sm" />
                      <span className="text-[#444] ml-1">({member.percent}%)</span>
                    </span>
                  </div>
                  <div className="h-[4px] bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${member.percent}%`, backgroundColor: "var(--positive)" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
