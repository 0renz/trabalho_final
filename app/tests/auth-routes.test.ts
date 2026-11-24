import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST as login } from "../src/app/api/auth/login/route";
import { POST as logout } from "../src/app/api/auth/logout/route";
import {
  DURACAO_SESSAO_SEGUNDOS,
  NOME_COOKIE_SESSAO,
  iniciarSessaoAdmin,
} from "../src/lib/session";
import { ArmazemCookiesFake } from "./helpers/cookie-store";

const estado = vi.hoisted(() => ({
  armazem: undefined as unknown,
}));

vi.mock("next/headers", () => ({
  cookies: async () => estado.armazem,
}));

const SENHA_TESTE = "senha-de-teste";
const SEGREDO_TESTE = "segredo-de-teste-com-mais-de-32-caracteres";

function armazemAtual(): ArmazemCookiesFake {
  return estado.armazem as ArmazemCookiesFake;
}

function requisicaoLogin(senha: string): Request {
  return new Request("http://localhost/api/auth/login", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ senha }).toString(),
  });
}

beforeEach(() => {
  vi.stubEnv("SESSION_SECRET", SEGREDO_TESTE);
  vi.stubEnv("ADMIN_PASSWORD", SENHA_TESTE);
  estado.armazem = new ArmazemCookiesFake();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("rota de login", () => {
  it("autentica com a senha correta e define o cookie", async () => {
    const resposta = await login(requisicaoLogin(SENHA_TESTE));

    expect(resposta.status).toBe(303);
    expect(resposta.headers.get("location")).toBe("http://localhost/admin");
    expect(armazemAtual().get(NOME_COOKIE_SESSAO)?.value).toBeTruthy();

    const opcoes = armazemAtual().opcoes.get(NOME_COOKIE_SESSAO);
    expect(opcoes).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    expect(opcoes?.maxAge).toBe(DURACAO_SESSAO_SEGUNDOS - 60);
  });

  it("rejeita senha incorreta com mensagem genérica e sem cookie", async () => {
    const resposta = await login(requisicaoLogin("senha-incorreta"));

    expect(resposta.status).toBe(303);
    expect(resposta.headers.get("location")).toBe(
      "http://localhost/login?erro=1",
    );
    expect(armazemAtual().get(NOME_COOKIE_SESSAO)).toBeUndefined();
  });

  it("rejeita senha vazia com mensagem genérica e sem cookie", async () => {
    const resposta = await login(requisicaoLogin(""));

    expect(resposta.status).toBe(303);
    expect(resposta.headers.get("location")).toBe(
      "http://localhost/login?erro=1",
    );
    expect(armazemAtual().get(NOME_COOKIE_SESSAO)).toBeUndefined();
  });

  it("rejeita corpo que não é formulário", async () => {
    const resposta = await login(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ senha: SENHA_TESTE }),
      }),
    );

    expect(resposta.status).toBe(303);
    expect(resposta.headers.get("location")).toBe(
      "http://localhost/login?erro=1",
    );
    expect(armazemAtual().get(NOME_COOKIE_SESSAO)).toBeUndefined();
  });

  it("falha fechado quando a configuração está ausente", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "");
    const erro = vi.spyOn(console, "error").mockImplementation(() => {});

    const resposta = await login(requisicaoLogin(SENHA_TESTE));

    expect(resposta.status).toBe(303);
    expect(resposta.headers.get("location")).toBe(
      "http://localhost/login?erro=2",
    );
    expect(armazemAtual().get(NOME_COOKIE_SESSAO)).toBeUndefined();
    expect(erro).toHaveBeenCalled();
  });
});

describe("rota de logout", () => {
  it("encerra a sessão e remove o cookie", async () => {
    const armazem = armazemAtual();
    await iniciarSessaoAdmin(armazem);

    const resposta = await logout(
      new Request("http://localhost/api/auth/logout", { method: "POST" }),
    );

    expect(resposta.status).toBe(303);
    expect(resposta.headers.get("location")).toBe("http://localhost/login");
    expect(armazem.get(NOME_COOKIE_SESSAO)).toBeUndefined();
  });

  it("remove o cookie mesmo sem configuração válida", async () => {
    const armazem = armazemAtual();
    armazem.definir(NOME_COOKIE_SESSAO, "valor-invalido");
    vi.stubEnv("SESSION_SECRET", "");

    const resposta = await logout(
      new Request("http://localhost/api/auth/logout", { method: "POST" }),
    );

    expect(resposta.status).toBe(303);
    expect(resposta.headers.get("location")).toBe("http://localhost/login");
    expect(armazem.get(NOME_COOKIE_SESSAO)).toBeUndefined();
  });
});
