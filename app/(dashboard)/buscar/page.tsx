export const metadata = { title: "Buscar" };

export default function BuscarPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Buscar</h1>
        <p className="text-secondary mt-1">Encontre qualquer movimento, conta ou evidência em um só lugar.</p>
      </header>

      <section className="rounded-2xl border border-border bg-surface p-5 space-y-4">
        <label htmlFor="global-search" className="text-sm font-semibold text-foreground">
          Busca global
        </label>
        <input
          id="global-search"
          type="search"
          placeholder="Buscar transação, conta, merchant ou documento"
          className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
        <p className="text-sm text-secondary">
          Busca global. Em breve incluirá histórico operacional completo.
        </p>
      </section>
    </div>
  );
}
