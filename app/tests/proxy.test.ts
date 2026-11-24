import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { proxy } from "../src/proxy";
import {
  DURACAO_SESSAO_SEGUNDOS,
  NOME_COOKIE_SESSAO,
  iniciarSessaoAdmin,
  obterSessaoAdmin,
} from "../src/lib/session";
import { ArmazemCookiesFake } from "./helpers/cookie-store";

const SEGREDO_TESTE = "segredo-de-teste-com-mais-de-32-caracteres";
const SENHA_TESTE = "senha-de-teste";

function requisicao(caminho: string, cookie?: string): NextRequest {
  return new NextRequest(new URL(caminho, "http://localhost"), {
    ...(cookie ? { headers: { cookie } } : {}),
  });
}

async function cookieValido(): Promise<string> {
  const armazem = new ArmazemCookiesFake();
  await iniciarSessaoAdmin(armazem);

  const valor = armazem.get(NOME_COOKIE_SESSAO)?.value;

  if (!valor) {
    throw new Error("Cookie de sessão não foi criado.");
  }

  return `${NOME_COOKIE_SESSAO}=${valor}`;
}

function adulterarCookie(cookie: string): string {
  const separador = cookie.indexOf("=");
  const nome = cookie.slice(0, separador);
  const valor = cookie.slice(separador + 1);
  const posicao = Math.floor(valor.length / 2);
  const adulterado =
    valor.slice(0, posicao) +
    (valor[posicao] === "a" ? "b" : "a") +
    valor.slice(posicao + 1);

  return `${nome}=${adulterado}`;
}

beforeEach(() => {
  vi.stubEnv("SESSION_SECRET", SEGREDO_TESTE);
  vi.stubEnv("ADMIN_PASSWORD", SENHA_TESTE);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("proxy da área administrativa", () => {
  it("libera a rota /admin com sessão válida", async () => {
    const resposta = await proxy(requisicao("/admin", await cookieValido()));

    expect(resposta.status).toBe(200);
    expect(resposta.headers.get("x-middleware-next")).toBe("1");
    expect(resposta.headers.get("location")).toBeNull();
  });

  it("redireciona para o login quando não há sessão", async () => {
    const resposta = await proxy(requisicao("/admin"));

    expect(resposta.status).toBe(303);
    expect(resposta.headers.get("location")).toBe("http://localhost/login");
  });

  it("descarta parâmetros da URL ao redirecionar", async () => {
    const resposta = await proxy(
      requisicao("/admin?next=https%3A%2F%2Fevil.example"),
    );

    expect(resposta.status).toBe(303);
    expect(resposta.headers.get("location")).toBe("http://localhost/login");
  });

  it("rejeita cookie adulterado", async () => {
    const aviso = vi.spyOn(console, "warn").mockImplementation(() => {});
    const resposta = await proxy(
      requisicao("/admin", adulterarCookie(await cookieValido())),
    );

    expect(resposta.status).toBe(303);
    expect(resposta.headers.get("location")).toBe("http://localhost/login");
    expect(aviso).toHaveBeenCalledWith(expect.stringContaining("invalid"));
  });

  it("rejeita cookie expirado após oito horas", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const cookie = await cookieValido();

    vi.setSystemTime(
      new Date(
        new Date("2026-01-01T00:00:00.000Z").getTime() +
          (DURACAO_SESSAO_SEGUNDOS + 61) * 1000,
      ),
    );

    const resposta = await proxy(requisicao("/admin", cookie));

    expect(resposta.status).toBe(303);
    expect(resposta.headers.get("location")).toBe("http://localhost/login");
  });

  it("rejeita sessão sem a marca de autenticação", async () => {
    const armazem = new ArmazemCookiesFake();
    await iniciarSessaoAdmin(armazem);

    const sessao = await obterSessaoAdmin(armazem);
    sessao.autenticado = false;
    await sessao.save();

    const valor = armazem.get(NOME_COOKIE_SESSAO)?.value ?? "";
    const resposta = await proxy(
      requisicao("/admin", `${NOME_COOKIE_SESSAO}=${valor}`),
    );

    expect(resposta.status).toBe(303);
    expect(resposta.headers.get("location")).toBe("http://localhost/login");
  });

  it("falha fechado quando SESSION_SECRET está ausente", async () => {
    const cookie = await cookieValido();
    vi.stubEnv("SESSION_SECRET", "");

    const resposta = await proxy(requisicao("/admin", cookie));

    expect(resposta.status).toBe(303);
    expect(resposta.headers.get("location")).toBe("http://localhost/login");
  });
});
