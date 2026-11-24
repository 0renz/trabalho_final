import { createHash, timingSafeEqual } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";
import {
  getIronSession,
  nextProxyCookies,
  type CookieStore,
  type IronSession,
  type SessionOptions,
} from "iron-session";

export const NOME_COOKIE_SESSAO = "admin_session";
export const DURACAO_SESSAO_SEGUNDOS = 60 * 60 * 8;

const TAMANHO_MINIMO_SEGREDO = 32;

export type DadosSessaoAdmin = {
  autenticado?: boolean;
  criadoEm?: number;
};

export class ConfiguracaoAutenticacaoError extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "ConfiguracaoAutenticacaoError";
  }
}

export class NaoAutenticadoError extends Error {
  constructor() {
    super("Sessão administrativa ausente, inválida ou expirada.");
    this.name = "NaoAutenticadoError";
  }
}

function obterSegredoSessao(): string {
  const segredo = process.env.SESSION_SECRET;

  if (!segredo || segredo.length < TAMANHO_MINIMO_SEGREDO) {
    throw new ConfiguracaoAutenticacaoError(
      `SESSION_SECRET ausente ou com menos de ${TAMANHO_MINIMO_SEGREDO} caracteres.`,
    );
  }

  return segredo;
}

function obterSenhaAdmin(): string {
  const senha = process.env.ADMIN_PASSWORD;

  if (!senha) {
    throw new ConfiguracaoAutenticacaoError("ADMIN_PASSWORD ausente.");
  }

  return senha;
}

export function criarOpcoesSessao(): SessionOptions {
  return {
    cookieName: NOME_COOKIE_SESSAO,
    password: obterSegredoSessao(),
    ttl: DURACAO_SESSAO_SEGUNDOS,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    },
    onUnsealError: (motivo) => {
      if (motivo !== "expired") {
        console.warn(`Sessão administrativa rejeitada (${motivo}).`);
      }
    },
  };
}

export function compararSenhaSegura(
  fornecida: string,
  esperada: string,
): boolean {
  const digestFornecido = createHash("sha256").update(fornecida, "utf8").digest();
  const digestEsperado = createHash("sha256").update(esperada, "utf8").digest();

  return timingSafeEqual(digestFornecido, digestEsperado);
}

export function compararSenhaAdmin(fornecida: string): boolean {
  return compararSenhaSegura(fornecida, obterSenhaAdmin());
}

export async function obterSessaoAdmin(
  armazemCookies: CookieStore,
): Promise<IronSession<DadosSessaoAdmin>> {
  return getIronSession<DadosSessaoAdmin>(
    armazemCookies,
    criarOpcoesSessao(),
  );
}

export async function obterSessaoAdminDoProxy(
  request: NextRequest,
  response: NextResponse,
): Promise<IronSession<DadosSessaoAdmin>> {
  return getIronSession<DadosSessaoAdmin>(
    nextProxyCookies(request, response),
    criarOpcoesSessao(),
  );
}

export function estaAutenticado(
  sessao: IronSession<DadosSessaoAdmin>,
): boolean {
  return sessao.autenticado === true;
}

export async function iniciarSessaoAdmin(
  armazemCookies: CookieStore,
): Promise<void> {
  const sessao = await obterSessaoAdmin(armazemCookies);

  sessao.autenticado = true;
  sessao.criadoEm = Date.now();
  await sessao.save();
}

export async function encerrarSessaoAdmin(
  armazemCookies: CookieStore,
): Promise<void> {
  const sessao = await obterSessaoAdmin(armazemCookies);
  sessao.destroy();
}

export async function exigirSessaoAdmin(
  armazemCookies: CookieStore,
): Promise<IronSession<DadosSessaoAdmin>> {
  const sessao = await obterSessaoAdmin(armazemCookies);

  if (!estaAutenticado(sessao)) {
    throw new NaoAutenticadoError();
  }

  return sessao;
}
