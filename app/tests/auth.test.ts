import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ArmazemCookiesFake } from "./helpers/cookie-store";
import {
  ConfiguracaoAutenticacaoError,
  DURACAO_SESSAO_SEGUNDOS,
  NOME_COOKIE_SESSAO,
  NaoAutenticadoError,
  compararSenhaAdmin,
  compararSenhaSegura,
  criarOpcoesSessao,
  encerrarSessaoAdmin,
  estaAutenticado,
  exigirSessaoAdmin,
  iniciarSessaoAdmin,
  obterSessaoAdmin,
} from "../src/lib/session";

const SEGREDO_TESTE = "segredo-de-teste-com-mais-de-32-caracteres";
const SENHA_TESTE = "senha-de-teste";

beforeEach(() => {
  vi.stubEnv("SESSION_SECRET", SEGREDO_TESTE);
  vi.stubEnv("ADMIN_PASSWORD", SENHA_TESTE);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("configuração da autenticação", () => {
  it("cria opções de sessão com cookie seguro e expiração de oito horas", () => {
    const opcoes = criarOpcoesSessao();

    expect(opcoes.cookieName).toBe(NOME_COOKIE_SESSAO);
    expect(opcoes.ttl).toBe(DURACAO_SESSAO_SEGUNDOS);
    expect(opcoes.cookieOptions).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    expect(opcoes.cookieOptions?.secure).toBe(false);
  });

  it("marca o cookie como Secure em produção", () => {
    vi.stubEnv("NODE_ENV", "production");

    const opcoes = criarOpcoesSessao();

    expect(opcoes.cookieOptions?.secure).toBe(true);
  });

  it("falha fechado quando SESSION_SECRET está ausente", () => {
    vi.stubEnv("SESSION_SECRET", "");

    expect(() => criarOpcoesSessao()).toThrow(ConfiguracaoAutenticacaoError);
  });

  it("falha fechado quando SESSION_SECRET é curto", () => {
    vi.stubEnv("SESSION_SECRET", "x".repeat(31));

    expect(() => criarOpcoesSessao()).toThrow(ConfiguracaoAutenticacaoError);
  });

  it("aceita SESSION_SECRET com exatamente 32 caracteres", () => {
    vi.stubEnv("SESSION_SECRET", "x".repeat(32));

    expect(() => criarOpcoesSessao()).not.toThrow();
  });

  it("falha fechado quando ADMIN_PASSWORD está ausente", () => {
    vi.stubEnv("ADMIN_PASSWORD", "");

    expect(() => compararSenhaAdmin("qualquer")).toThrow(
      ConfiguracaoAutenticacaoError,
    );
  });

  it("falha fechado ao ler a sessão sem SESSION_SECRET", async () => {
    vi.stubEnv("SESSION_SECRET", "");

    await expect(obterSessaoAdmin(new ArmazemCookiesFake())).rejects.toThrow(
      ConfiguracaoAutenticacaoError,
    );
  });
});

describe("comparação de senha", () => {
  it("aceita a senha correta e rejeita a incorreta", () => {
    expect(compararSenhaSegura(SENHA_TESTE, SENHA_TESTE)).toBe(true);
    expect(compararSenhaSegura("senha-errada", SENHA_TESTE)).toBe(false);
    expect(compararSenhaAdmin(SENHA_TESTE)).toBe(true);
    expect(compararSenhaAdmin("senha-errada")).toBe(false);
  });

  it("não lança erro quando os tamanhos são diferentes", () => {
    expect(compararSenhaSegura("", SENHA_TESTE)).toBe(false);
    expect(compararSenhaSegura("x", SENHA_TESTE)).toBe(false);
    expect(compararSenhaSegura("á".repeat(100), SENHA_TESTE)).toBe(false);
  });
});

describe("sessão administrativa", () => {
  it("inicia, lê e encerra a sessão", async () => {
    const armazem = new ArmazemCookiesFake();

    const inicial = await obterSessaoAdmin(armazem);
    expect(estaAutenticado(inicial)).toBe(false);

    await iniciarSessaoAdmin(armazem);

    const cookie = armazem.get(NOME_COOKIE_SESSAO);
    expect(cookie?.value).toBeTruthy();
    expect(cookie?.value).not.toContain("autenticado");

    const autenticada = await obterSessaoAdmin(armazem);
    expect(estaAutenticado(autenticada)).toBe(true);
    expect(autenticada.criadoEm).toBeTypeOf("number");

    const exigida = await exigirSessaoAdmin(armazem);
    expect(estaAutenticado(exigida)).toBe(true);

    const opcoesCookie = armazem.opcoes.get(NOME_COOKIE_SESSAO);
    expect(opcoesCookie).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    expect(opcoesCookie?.maxAge).toBe(DURACAO_SESSAO_SEGUNDOS - 60);

    await encerrarSessaoAdmin(armazem);

    expect(armazem.get(NOME_COOKIE_SESSAO)).toBeUndefined();
    const encerrada = await obterSessaoAdmin(armazem);
    expect(estaAutenticado(encerrada)).toBe(false);
    await expect(exigirSessaoAdmin(armazem)).rejects.toBeInstanceOf(
      NaoAutenticadoError,
    );
  });

  it("rejeita cookie adulterado mesmo presente no armazém", async () => {
    const armazem = new ArmazemCookiesFake();
    const aviso = vi.spyOn(console, "warn").mockImplementation(() => {});

    await iniciarSessaoAdmin(armazem);

    const original = armazem.get(NOME_COOKIE_SESSAO)?.value ?? "";
    const posicao = Math.floor(original.length / 2);
    const adulterado =
      original.slice(0, posicao) +
      (original[posicao] === "a" ? "b" : "a") +
      original.slice(posicao + 1);
    armazem.definir(NOME_COOKIE_SESSAO, adulterado);

    const sessao = await obterSessaoAdmin(armazem);

    expect(estaAutenticado(sessao)).toBe(false);
    expect(aviso).toHaveBeenCalledWith(expect.stringContaining("invalid"));
  });

  it("rejeita cookie expirado após oito horas", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const armazem = new ArmazemCookiesFake();
    await iniciarSessaoAdmin(armazem);

    vi.setSystemTime(
      new Date(
        new Date("2026-01-01T00:00:00.000Z").getTime() +
          (DURACAO_SESSAO_SEGUNDOS + 61) * 1000,
      ),
    );

    const sessao = await obterSessaoAdmin(armazem);

    expect(estaAutenticado(sessao)).toBe(false);
  });

  it("exige a marca de autenticação gravada no cookie", async () => {
    const armazem = new ArmazemCookiesFake();

    await iniciarSessaoAdmin(armazem);

    const sessao = await obterSessaoAdmin(armazem);
    sessao.autenticado = false;
    await sessao.save();

    const relida = await obterSessaoAdmin(armazem);

    expect(estaAutenticado(relida)).toBe(false);
  });
});
