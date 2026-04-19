import { AIComposerTransactionDraft } from "@/lib/ai/contracts";
import { resolveCategory, resolveTargetAccount } from "@/lib/ai/composer";
import Papa from "papaparse";

export async function parseDeterministicOFX(
  userId: string,
  householdId: string | null,
  ofxContent: string
): Promise<AIComposerTransactionDraft[]> {
  const drafts: AIComposerTransactionDraft[] = [];

  // Match each <STMTTRN> block
  const stmtRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/g;
  let match;

  while ((match = stmtRegex.exec(ofxContent)) !== null) {
    const block = match[1];

    const trnAmtMatch = block.match(/<TRNAMT>([^<\r\n]+)/);
    const dtPostedMatch = block.match(/<DTPOSTED>([^<\r\n]+)/);
    const memoMatch = block.match(/<MEMO>([^<\r\n]+)/);

    if (trnAmtMatch && dtPostedMatch) {
      const amountStr = trnAmtMatch[1].trim();
      const dateStr = dtPostedMatch[1].trim(); // Format: YYYYMMDDHHMMSS
      const memoStr = memoMatch ? memoMatch[1].trim() : "Transação via OFX";

      const amount = parseFloat(amountStr);
      let date = dateStr.substring(0, 8); // YYYYMMDD
      if (date.length === 8) {
        date = `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
      } else {
        date = new Date().toISOString().split("T")[0];
      }

      const transactionType = amount >= 0 ? "INCOME" : "EXPENSE";
      const targetCategory = await resolveCategory(userId, householdId, "Outros", transactionType, memoStr);
      const targetAccount = await resolveTargetAccount(userId, householdId, null, memoStr);

      drafts.push({
        amount: Math.abs(amount),
        date,
        description: memoStr.substring(0, 60),
        transactionType,
        categoryName: targetCategory.name,
        categoryId: targetCategory.id,
        accountId: targetAccount?.id ?? null,
        accountName: targetAccount?.name ?? null,
        confidence: { overall: 1, amount: 1, date: 1, description: 1, category: 1, account: 1, transactionType: 1 },
        source: "ofx",
      });
    }
  }

  return drafts;
}

export async function parseDeterministicCSV(
  userId: string,
  householdId: string | null,
  csvContent: string
): Promise<AIComposerTransactionDraft[]> {
  const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
  const drafts: AIComposerTransactionDraft[] = [];

  for (const row of parsed.data as any[]) {
    // Try to guess columns dynamically
    const keys = Object.keys(row);
    const getVal = (possibleNames: string[]) => {
      const key = keys.find(k => possibleNames.some(pn => k.toLowerCase().includes(pn)));
      return key ? String(row[key]) : undefined;
    };

    const dateRaw = getVal(["date", "data", "dia"]);
    const amountRaw = getVal(["amount", "valor", "value", "quantia"]);
    const descRaw = getVal(["description", "descrição", "historico", "histórico", "memo", "detail"]);

    if (dateRaw && amountRaw && descRaw) {
      let amount = parseFloat(amountRaw.replace(/[R$\s]/g, "").replace(",", "."));
      if (isNaN(amount)) continue;

      let date = dateRaw;
      // Convert DD/MM/YYYY to YYYY-MM-DD
      const dateParts = date.split("/");
      if (dateParts.length === 3) {
        date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      }

      const transactionType = amount >= 0 ? "INCOME" : "EXPENSE";
      const targetCategory = await resolveCategory(userId, householdId, "Outros", transactionType, descRaw);
      const targetAccount = await resolveTargetAccount(userId, householdId, null, descRaw);

      drafts.push({
        amount: Math.abs(amount),
        date: date.length === 10 ? date : new Date().toISOString().split("T")[0],
        description: descRaw.substring(0, 60),
        transactionType,
        categoryName: targetCategory.name,
        categoryId: targetCategory.id,
        accountId: targetAccount?.id ?? null,
        accountName: targetAccount?.name ?? null,
        confidence: { overall: 0.9, amount: 1, date: 1, description: 1, category: 0.8, account: 0.8, transactionType: 1 },
        source: "csv",
      });
    }
  }

  return drafts;
}
