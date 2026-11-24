import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ConfiguracaoAutenticacaoError,
  NOME_COOKIE_SESSAO,
  encerrarSessaoAdmin,
} from "@/lib/session";

export async function POST(request: Request) {
  const armazemCookies = await cookies();

  try {
    await encerrarSessaoAdmin(armazemCookies);
  } catch (erro) {
    if (!(erro instanceof ConfiguracaoAutenticacaoError)) {
      throw erro;
    }

    armazemCookies.delete(NOME_COOKIE_SESSAO);
  }

  return NextResponse.redirect(new URL("/login", request.url), 303);
}
