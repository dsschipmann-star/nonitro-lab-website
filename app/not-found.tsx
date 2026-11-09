import Link from "next/link";

export const metadata = {
  title: "Página não encontrada",
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <p className="eyebrow mb-4">404</p>
        <h1 className="mb-3 text-3xl font-semibold text-gradient">
          Página não encontrada
        </h1>
        <p className="mb-8 text-text-muted">
          O link acessado não existe ou foi movido. Volte para a página inicial
          e encontre nossos serviços.
        </p>
        <Link href="/" className="btn-primary">
          Voltar para o início
        </Link>
      </div>
    </main>
  );
}
