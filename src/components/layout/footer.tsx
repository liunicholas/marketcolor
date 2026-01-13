export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs text-muted-foreground">
          <span>MARKETCOLOR</span>
          <span>Data: Yahoo Finance · AI: OpenAI · Not financial advice</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
