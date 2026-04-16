import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Iniciando exportação do backlog...");

  const feedbacks = await prisma.productFeedback.findMany({
    where: {
      status: { in: ["new", "triaged"] }
    },
    orderBy: {
      priorityScore: "desc"
    }
  });

  if (feedbacks.length === 0) {
    console.log("ℹ️ Nenhum feedback pendente encontrado.");
    return;
  }

  let markdown = "# Backlog — Próxima Sprint\n\n";

  const priorities = ["high", "medium", "low"];
  const priorityLabels: Record<string, string> = {
    high: "Alta Prioridade",
    medium: "Média Prioridade",
    low: "Baixa Prioridade"
  };

  for (const priority of priorities) {
    const priorityFeedbacks = feedbacks.filter(f => f.impact === priority);
    
    if (priorityFeedbacks.length > 0) {
      markdown += `## ${priorityLabels[priority]}\n\n`;
      
      // Group by area
      const areas = Array.from(new Set(priorityFeedbacks.map(f => f.area)));
      
      for (const area of areas) {
        markdown += `### ${area.charAt(0).toUpperCase() + area.slice(1)}\n`;
        const areaFeedbacks = priorityFeedbacks.filter(f => f.area === area);
        
        for (const f of areaFeedbacks) {
          markdown += `- ${f.normalizedTitle}\n`;
          markdown += `    - Tipo: ${f.type}\n`;
          markdown += `    - Impacto: ${f.impact}\n`;
          markdown += `    - ID: #${f.id}\n`;
        }
        markdown += "\n";
      }
    }
  }

  const outputDir = path.join(process.cwd(), "docs", "product");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "backlog.md");
  fs.writeFileSync(outputPath, markdown);

  console.log(`✅ Backlog exportado com sucesso para: ${outputPath}`);
}

main()
  .catch((e) => {
    console.error("❌ Erro ao gerar backlog:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
