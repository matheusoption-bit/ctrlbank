import { describe, it, expect } from "vitest";
import { parseInboxText } from "../lib/inbox/parser";
import { normalizeInboxItems } from "../lib/finance/normalize";

describe("parseInboxText", () => {
  it("extracts expense rows from statement text", () => {
    const input = ["12/04/2026 Mercado Central R$ 89,90", "13/04/2026 Farmácia Popular R$ 45,10"].join("\n");

    const items = parseInboxText(input);

    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      description: "Mercado Central",
      amount: 89.9,
      type: "expense",
    });
  });

  it("infers income with transfer keywords", () => {
    const input = "14/04/2026 PIX Recebido João R$ 350,00";

    const [item] = parseInboxText(input);

    expect(item.type).toBe("income");
    expect(item.amount).toBe(350);
  });

  it("ignores lines without BRL currency pattern", () => {
    const items = parseInboxText("Linha sem valor\nOutra linha sem R$");
    expect(items).toHaveLength(0);
  });
});

describe("normalizeInboxItems", () => {
  it("maps parsed items into persisted transaction shape", () => {
    const parsed = parseInboxText("12/04/2026 Padaria R$ 20,00");

    const normalized = normalizeInboxItems(parsed);

    expect(normalized).toHaveLength(1);
    expect(normalized[0]).toMatchObject({
      description: "Padaria",
      amount: 20,
      type: "expense",
    });
    expect(normalized[0].date).toBeInstanceOf(Date);
  });
});
