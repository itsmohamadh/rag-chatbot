import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
        <p className="text-center">
          © {new Date().getFullYear()}{" "}
          <Link
            href="https://mohamadh.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Mohamad H
          </Link>
          . All rights reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link
            href="https://linkedin.com/in/itsmohamadh"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            LinkedIn
          </Link>

          <Link
            href="https://github.com/itsmohamadh"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </Link>

          <Link
            href="https://wa.me/+989217253448"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            WhatsApp
          </Link>

          <Link
            href="mailto:mhaqnegahdar@email.com"
            className="transition-colors hover:text-foreground"
          >
            Email
          </Link>
        </div>
      </div>
    </footer>
  );
}
