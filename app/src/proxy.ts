import { NextResponse, type NextRequest } from "next/server";
import {
  ConfiguracaoAutenticacaoError,
  estaAutenticado,
  obterSessaoAdminDoProxy,
} from "@/lib/session";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  try {
    const sessao = await obterSessaoAdminDoProxy(request, response);

    if (estaAutenticado(sessao)) {
      return response;
    }
  } catch (erro) {
    if (!(erro instanceof ConfiguracaoAutenticacaoError)) {
      throw erro;
    }
  }

  const destino = request.nextUrl.clone();
  destino.pathname = "/login";
  destino.search = "";
  destino.hash = "";

  return NextResponse.redirect(destino, 303);
}

export const config = {
  matcher: ["/admin/:path*"],
};
