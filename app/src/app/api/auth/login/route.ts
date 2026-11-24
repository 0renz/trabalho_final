import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ConfiguracaoAutenticacaoError,
  compararSenhaAdmin,
  iniciarSessaoAdmin,
} from "@/lib/session";

function redirecionar(request: Request, caminho: string) {
  return NextResponse.redirect(new URL(caminho, request.url), 303);
}

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return redirecionar(request, "/login?erro=1");
  }

  const senha = formData.get("senha");

  if (typeof senha !== "string" || senha.length === 0) {
    return redirecionar(request, "/login?erro=1");
  }

  try {
    if (!compararSenhaAdmin(senha)) {
      return redirecionar(request, "/login?erro=1");
    }

    await iniciarSessaoAdmin(await cookies());
    return redirecionar(request, "/admin");
  } catch (erro) {
    if (erro instanceof ConfiguracaoAutenticacaoError) {
      console.error("Configuração de autenticação indisponível.");
      return redirecionar(request, "/login?erro=2");
    }

    throw erro;
  }
}
