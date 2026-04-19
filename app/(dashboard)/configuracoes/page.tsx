import CopyButton from "@/components/ui/CopyButton";
import Link from "next/link";
import {
  generateWhatsappToken,
  getInboxCaptureSettings,
  saveWhatsappPhone,
  unlinkWhatsappNumber,
} from "@/app/actions/inbox";

export default async function ConfiguracoesPage() {
  const settings = await getInboxCaptureSettings();
  return (
    <div className="space-y-7">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Configurações</h1>
        <p className="text-secondary mt-1">Central pessoal de perfil, contas, integrações de captura e preferências do sistema.</p>
      </header>

      <section className="rounded-2xl border border-border bg-surface p-5 space-y-4">
        <h2 className="text-xl font-extrabold">Perfil</h2>
        <p className="text-sm text-secondary">
          Gerencie sua área pessoal e os pontos-chave da sua conta no CtrlBank.
        </p>
        <div className="rounded-xl bg-surface-2 px-4 py-3 border border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="font-semibold">Contas financeiras</p>
            <p className="text-sm text-secondary">Acesse todas as suas contas bancárias e cartões em um único lugar.</p>
          </div>
          <Link
            href="/contas"
            className="inline-flex items-center justify-center rounded-xl border border-border px-3 py-2 text-sm font-semibold hover:bg-white/5"
          >
            Gerenciar contas
          </Link>
        </div>
        <div id="convidar" className="rounded-xl bg-surface-2 px-4 py-3 border border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="font-semibold">Convidar membro</p>
            <p className="text-sm text-secondary">Convide alguém para compartilhar a gestão financeira familiar.</p>
          </div>
          <Link
            href="/familia"
            className="inline-flex items-center justify-center rounded-xl border border-border px-3 py-2 text-sm font-semibold hover:bg-white/5"
          >
            Abrir área da família
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 space-y-4">
        <h2 className="text-xl font-extrabold">Integrações de captura</h2>
        <h3 className="text-sm font-semibold text-secondary uppercase tracking-wide">E-mail de captura</h3>
        <p className="text-sm text-secondary">
          Encaminhe comprovantes para este endereço e eles aparecem automaticamente na sua Inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between rounded-xl bg-surface-2 px-4 py-3 border border-border">
          <code className="text-sm font-semibold break-all">{settings.dedicatedEmail}</code>
          <CopyButton value={settings.dedicatedEmail} />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 space-y-4">
        <h3 className="text-sm font-semibold text-secondary uppercase tracking-wide">WhatsApp</h3>

        {settings.whatsappNumber ? (
          <div className="space-y-3">
            <p className="text-sm text-secondary">
              Número vinculado: <span className="font-semibold text-foreground">{settings.whatsappNumber}</span>
            </p>
            <form action={unlinkWhatsappNumber}>
              <button className="rounded-xl border border-border px-3 py-2 text-sm font-semibold hover:bg-white/5">
                Desvincular número
              </button>
            </form>
          </div>
        ) : (
          <form action={saveWhatsappPhone} className="space-y-3">
            <label className="text-sm font-semibold">Número (E.164)</label>
            <input
              type="tel"
              name="phone"
              defaultValue={settings.phone ?? ""}
              placeholder="+5511999999999"
              pattern="^\+[1-9]\d{7,14}$"
              required
              className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button className="rounded-xl border border-border px-3 py-2 text-sm font-semibold hover:bg-white/5">
              Salvar número
            </button>
          </form>
        )}

        <div className="rounded-xl border border-border bg-surface-2 px-4 py-3 space-y-2">
          <p className="text-sm">
            Envie uma mensagem para <span className="font-semibold">{settings.twilioNumber}</span> com o código:{" "}
            <span className="font-bold">CTRL-{settings.whatsappLinkToken ?? "------"}</span>
          </p>
          {settings.whatsappLinkTokenExpiresAt && (
            <p className="text-xs text-secondary">
              Código expira em: {new Date(settings.whatsappLinkTokenExpiresAt).toLocaleString("pt-BR")}
            </p>
          )}
          <form action={generateWhatsappToken}>
            <button className="rounded-xl border border-border px-3 py-2 text-sm font-semibold hover:bg-white/5">
              Gerar código de vinculação
            </button>
          </form>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 space-y-4">
        <h2 className="text-xl font-extrabold">Preferências e sistema</h2>
        <p className="text-sm text-secondary">
          Em breve você poderá configurar notificações, visualização padrão e automações operacionais da sua conta.
        </p>
        <div className="rounded-xl border border-dashed border-border bg-surface-2 px-4 py-3">
          <p className="text-sm text-secondary">
            Placeholder de preferências pronto para expansão sem alterar a arquitetura atual.
          </p>
        </div>
      </section>
    </div>
  );
}
