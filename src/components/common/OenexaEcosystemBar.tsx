const ECOSYSTEM_LINKS = [
  { id: "portal", label: "Portal", href: process.env.NEXT_PUBLIC_OENEXA_PORTAL_URL || "https://app.oenexa.com" },
  { id: "exchange", label: "Exchange", href: process.env.NEXT_PUBLIC_OENEXA_EXCHANGE_URL || "https://exchange.oenexa.com/trade" },
  { id: "wallet", label: "Wallet", href: process.env.NEXT_PUBLIC_OENEXA_WALLET_URL || "https://wallet.oenexa.com/wallet" },
  { id: "chain", label: "Blockchain", href: process.env.NEXT_PUBLIC_OENEXA_EXPLORER_URL || "https://explorer.oenexa.com" },
  { id: "ai", label: "OENXA AI", href: process.env.NEXT_PUBLIC_OENEXA_AI_URL || "https://ai.oenexa.com" },
  { id: "oengo", label: "OENGO", href: "/" },
  { id: "security", label: "Security Center", href: process.env.NEXT_PUBLIC_OENEXA_SECURITY_URL || "https://app.oenexa.com/security" },
  { id: "docs", label: "Docs", href: process.env.NEXT_PUBLIC_OENEXA_DOCS_URL || "https://docs.oenexa.com" },
];

export function OenexaEcosystemBar({ activeProduct = "oengo" }: { activeProduct?: string }) {
  return (
    <div
      data-testid="oenexa-ecosystem-bar"
      className="h-8 px-4 flex items-center justify-between bg-[var(--ox-bg-canvas,#0b0e14)] border-b border-[var(--ox-border-subtle,#232b3b)] text-[11px] overflow-x-auto"
    >
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="font-bold tracking-wider text-[var(--ox-accent-primary,#f0b90b)] mr-2">
          OENEXA ECOSYSTEM
        </span>
        {ECOSYSTEM_LINKS.map((item) => {
          const active = item.id === activeProduct;
          return (
            <a
              key={item.id}
              href={item.href}
              target={active ? undefined : "_blank"}
              rel={active ? undefined : "noopener noreferrer"}
              className={
                active
                  ? "px-2 py-0.5 rounded bg-[var(--ox-bg-elevated,#1f2533)] text-[var(--ox-text-primary,#f0f3f6)] font-semibold"
                  : "px-2 py-0.5 rounded text-[var(--ox-text-secondary,#8c9ba8)] hover:text-[var(--ox-text-primary,#f0f3f6)] transition-colors"
              }
            >
              {item.label}
            </a>
          );
        })}
      </div>
      <span className="hidden md:inline text-[10px] font-mono text-[var(--ox-text-muted,#5a6878)] whitespace-nowrap ml-4">
        SSO · id.oenexa.com
      </span>
    </div>
  );
}
