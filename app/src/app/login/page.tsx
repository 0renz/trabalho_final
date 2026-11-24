import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ConfiguracaoAutenticacaoError,
  estaAutenticado,
  obterSessaoAdmin,
} from "@/lib/session";

export const metadata: Metadata = {
  title: "Acesso da coordenação — Semana Acadêmica",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: Props) {
  const parametros = await searchParams;
  let autenticado = false;

  try {
    const sessao = await obterSessaoAdmin(await cookies());
    autenticado = estaAutenticado(sessao);
  } catch (erro) {
    if (!(erro instanceof ConfiguracaoAutenticacaoError)) {
      throw erro;
    }
  }

  if (autenticado) {
    redirect("/admin");
  }

  const erro = parametros.erro;
  const mensagemErro =
    erro === "1"
      ? "Não foi possível entrar. Verifique a senha e tente novamente."
      : erro === "2"
        ? "Não foi possível entrar agora. Tente novamente mais tarde."
        : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium text-slate-500">Semana Acadêmica</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          Acesso da coordenação
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Informe a senha administrativa para continuar.
        </p>

        {mensagemErro ? (
          <p
            id="erro-login"
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          >
            {mensagemErro}
          </p>
        ) : null}

        <form method="post" action="/api/auth/login" className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="senha"
              className="block text-sm font-medium text-slate-700"
            >
              Senha
            </label>
            <input
              id="senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              required
              aria-describedby={mensagemErro ? "erro-login" : undefined}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Acesso restrito à coordenação.
        </p>
        <p className="mt-2 text-center text-xs">
          <Link
            href="/"
            className="text-slate-500 underline-offset-4 hover:text-slate-700 hover:underline"
          >
            Voltar para o início
          </Link>
        </p>
      </section>
    </main>
  );
}
