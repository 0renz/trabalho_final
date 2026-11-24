import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ConfiguracaoAutenticacaoError,
  NaoAutenticadoError,
  exigirSessaoAdmin,
} from "@/lib/session";

export const metadata: Metadata = {
  title: "Área administrativa — Semana Acadêmica",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  try {
    await exigirSessaoAdmin(await cookies());
  } catch (erro) {
    if (
      erro instanceof NaoAutenticadoError ||
      erro instanceof ConfiguracaoAutenticacaoError
    ) {
      redirect("/login");
    }

    throw erro;
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6 py-12">
      <div>
        <p className="text-sm font-medium text-slate-500">Semana Acadêmica</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Área administrativa
        </h1>
        <p className="mt-2 text-slate-600">
          Acesso confirmado. As funcionalidades de gestão serão adicionadas nas
          próximas etapas.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-700">Sessão administrativa ativa.</p>
        <form method="post" action="/api/auth/logout" className="mt-4">
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Sair
          </button>
        </form>
      </section>

      <p className="text-sm">
        <Link
          href="/"
          className="text-slate-500 underline-offset-4 hover:text-slate-700 hover:underline"
        >
          Voltar para o início
        </Link>
      </p>
    </main>
  );
}
