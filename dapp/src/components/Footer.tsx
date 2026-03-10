import { Coffee } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Coffee className="h-4 w-4 text-primary" />
            <span className="text-sm">© 2026 BuyMeCoffee on Stacks. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href="https://docs.stacks.co"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Stacks Docs
            </a>
            <a
              href="https://explorer.hiro.so"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Explorer
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
