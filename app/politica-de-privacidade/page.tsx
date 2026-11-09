import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description:
    "Como a Nonitro Lab trata os dados compartilhados por clientes durante o processo de orçamento, reparo e devolução de equipamentos.",
  alternates: { canonical: "/politica-de-privacidade" },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="container-narrow pb-24 pt-36">
        <nav aria-label="Trilha" className="mb-6 text-xs text-text-dim">
          <Link href="/" className="hover:text-text">
            Início
          </Link>
          <span className="mx-2">/</span>
          <span>Política de privacidade</span>
        </nav>

        <h1 className="text-balance text-3xl font-semibold text-gradient sm:text-4xl">
          Política de privacidade
        </h1>
        <p className="mt-3 text-sm text-text-dim">
          Última atualização: {new Date().getFullYear()}.
        </p>

        <div className="prose prose-invert mt-10 max-w-none text-text-muted">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-text">1. Quem somos</h2>
            <p>
              A {siteConfig.name} é um laboratório técnico de assistência em
              eletrônicos localizado em {siteConfig.location.neighborhood},{" "}
              {siteConfig.location.city} — {siteConfig.location.state}. Nosso
              atendimento é digital, com recebimento e devolução de equipamentos
              mediante logística previamente combinada.
            </p>
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-text">
              2. Quais dados tratamos
            </h2>
            <p>
              Tratamos apenas os dados necessários para prestar o serviço:
              nome, canal de contato (WhatsApp ou e-mail), informações sobre o
              equipamento recebido e o defeito relatado, além dos dados
              cadastrais necessários para emissão de documento fiscal, quando
              aplicável.
            </p>
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-text">
              3. Como usamos essas informações
            </h2>
            <ul className="list-disc pl-5">
              <li>Para elaborar e comunicar o orçamento do serviço.</li>
              <li>Para organizar a logística de envio e devolução.</li>
              <li>
                Para registrar as etapas de recebimento, diagnóstico, reparo
                e devolução do equipamento.
              </li>
              <li>Para cumprir obrigações legais e fiscais aplicáveis.</li>
            </ul>
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-text">
              4. Compartilhamento
            </h2>
            <p>
              Não vendemos nem comercializamos dados de clientes. O
              compartilhamento ocorre apenas com fornecedores estritamente
              necessários à prestação do serviço (por exemplo, transportadoras
              em caso de envio) e com autoridades, quando exigido por lei.
            </p>
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-text">5. Seus direitos</h2>
            <p>
              Você pode solicitar acesso, correção ou exclusão dos seus dados,
              observadas as obrigações legais de guarda. Para exercer esses
              direitos, entre em contato pelos canais oficiais da{" "}
              {siteConfig.name}.
            </p>
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-text">6. Contato</h2>
            <p>
              Dúvidas sobre esta política podem ser enviadas pelo WhatsApp da{" "}
              {siteConfig.name}. Esta página pode ser atualizada; consulte
              sempre a versão mais recente.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
