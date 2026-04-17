"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, TrendingUp, TrendingDown, AlertTriangle, Target, X } from "lucide-react";
import { dismissRecommendation } from "@/app/actions/health";
import { useState } from "react";
import { toast } from "sonner";

interface HealthScoreData {
  score: number;
  classification: "Saudável" | "Atenção" | "Risco";
  breakdown: {
    spending: number;
    growth: number;
    commitments: number;
    goals: number;
  };
}

interface ProjectionData {
  currentBalance: number;
  projectedBalance30d: number;
  daysUntilZero: number | null;
  message: string;
  projectionPoints: Array<{ day: number; balance: number }>;
}

interface BalanceData {
  current: number;
  lastMonth: number;
  change: number;
}

interface BurnRateData {
  last30Days: number;
  previous30Days: number;
  changePercent: number;
}

interface Recommendation {
  id: string;
  type: string;
  message: string;
  score: number;
  createdAt: string;
}

interface SaudePageClientProps {
  healthScore: HealthScoreData | null;
  projection: ProjectionData | null;
  balance: BalanceData;
  burnRate: BurnRateData;
  recommendations: Recommendation[];
}

export default function SaudePageClient({
  healthScore,
  projection,
  balance,
  burnRate,
  recommendations: initialRecommendations
}: SaudePageClientProps) {
  const [recommendations, setRecommendations] = useState(initialRecommendations);

  const handleDismiss = async (id: string) => {
    try {
      await dismissRecommendation(id);
      setRecommendations(recommendations.filter(r => r.id !== id));
      toast.success("Alerta dispensado");
    } catch (error) {
      toast.error("Erro ao dispensar alerta");
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Saudável":
        return "text-green-600 bg-green-50";
      case "Atenção":
        return "text-yellow-600 bg-yellow-50";
      case "Risco":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Saúde Financeira</h1>
        <p className="text-secondary mt-1">Diagnóstico completo da saúde financeira familiar.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* BLOCK 1: Health Score */}
        {healthScore && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Score de Saúde Financeira
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center">
                  <div className="text-6xl font-black mb-2">{healthScore.score}</div>
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getClassificationColor(healthScore.classification)}`}>
                    {healthScore.classification}
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Controle de gastos</span>
                      <span className="font-semibold">{healthScore.breakdown.spending}/40</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${(healthScore.breakdown.spending / 40) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Crescimento de saldo</span>
                      <span className="font-semibold">{healthScore.breakdown.growth}/30</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${(healthScore.breakdown.growth / 30) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Compromissos fixos</span>
                      <span className="font-semibold">{healthScore.breakdown.commitments}/20</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 transition-all"
                        style={{ width: `${(healthScore.breakdown.commitments / 20) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progresso em metas</span>
                      <span className="font-semibold">{healthScore.breakdown.goals.toFixed(1)}/10</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 transition-all"
                        style={{ width: `${(healthScore.breakdown.goals / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* BLOCK 2: Consolidated Balance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Saldo Consolidado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{formatCurrency(balance.current)}</div>
            <div className="flex items-center gap-2 text-sm">
              {balance.change >= 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">+{formatCurrency(balance.change)}</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-red-600">{formatCurrency(balance.change)}</span>
                </>
              )}
              <span className="text-muted-foreground">vs. mês anterior</span>
            </div>
          </CardContent>
        </Card>

        {/* BLOCK 3: Burn Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Burn Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{formatCurrency(burnRate.last30Days)}</div>
            <div className="text-sm text-muted-foreground mb-2">Últimos 30 dias</div>
            <div className="flex items-center gap-2 text-sm">
              {burnRate.changePercent > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-red-600" />
                  <span className="text-red-600">+{burnRate.changePercent.toFixed(1)}%</span>
                </>
              ) : burnRate.changePercent < 0 ? (
                <>
                  <TrendingDown className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">{burnRate.changePercent.toFixed(1)}%</span>
                </>
              ) : (
                <span className="text-muted-foreground">Sem variação</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* BLOCK 4: Cash Flow Projection */}
        {projection && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Projeção de Caixa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{formatCurrency(projection.projectedBalance30d)}</div>
              <div className="text-sm text-muted-foreground mb-4">Em 30 dias</div>
              <p className="text-sm mb-4">{projection.message}</p>

              {/* Mini projection chart */}
              <div className="flex items-end gap-1 h-16">
                {projection.projectionPoints.map((point, idx) => {
                  const maxBalance = Math.max(...projection.projectionPoints.map(p => p.balance));
                  const minBalance = Math.min(...projection.projectionPoints.map(p => p.balance));
                  const range = maxBalance - minBalance || 1;
                  const height = ((point.balance - minBalance) / range) * 100;

                  return (
                    <div
                      key={idx}
                      className="flex-1 bg-blue-500 rounded-t"
                      style={{ height: `${Math.max(height, 5)}%` }}
                      title={`Dia ${point.day}: ${formatCurrency(point.balance)}`}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* BLOCK 5: Active Alerts */}
        {recommendations.length > 0 && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alertas Ativos
              </CardTitle>
              <CardDescription>
                {recommendations.length} {recommendations.length === 1 ? 'recomendação ativa' : 'recomendações ativas'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="mt-1">
                      {rec.type === "ALERT" && <AlertTriangle className="h-5 w-5 text-red-500" />}
                      {rec.type === "WARNING" && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                      {rec.type === "SUGGESTION" && <Target className="h-5 w-5 text-blue-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{rec.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(rec.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDismiss(rec.id)}
                      className="p-1 hover:bg-accent rounded transition-colors"
                      title="Dispensar"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
