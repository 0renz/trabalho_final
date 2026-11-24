import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminPage from "../src/app/admin/page";
import {
  DURACAO_SESSAO_SEGUNDOS,
  NOME_COOKIE_SESSAO,
  iniciarSessaoAdmin,
  obterSessaoAdmin,
} from "../src/lib/session";
import { ArmazemCookiesFake } from "./helpers/cookie-store";

const estado = vi.hoisted(() => ({
  armazem: undefined as unknown,
  redirecionar: vi.fn((destino: string): never => {
    throw new Error(`redirecionado:${destino}`);
  }),
}));

vi.mock("next/headers", () => ({
  cookies: async () => estado.armazem,
}));

vi.mock("next/navigation", () => ({
  redirect: estado.redirecionar,
}));

const SEGREDO_TESTE = "segredo-de-teste-com-mais-de-32-caracteres";
const SENHA_TESTE = "senha-de-teste";

function usarArmazem(armazem: ArmazemCookiesFake) {
  estado.armazem = armazem;
}

beforeEach(() => {
  vi.stubEnv("SESSION_SECRET", SEGREDO_TESTE);
  vi.stubEnv("ADMIN_PASSWORD", SENHA_TESTE);
  estado.redirecionar.mockClear();
  usarArmazem(new ArmazemCookiesFake());
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("página da área administrativa", () => {
  it("renderiza quando a sessão é válida", async () => {
    const armazem = new ArmazemCookiesFake();
    usarArmazem(armazem);
    await iniciarSessaoAdmin(armazem);

    await expect(AdminPage()).resolves.toBeTruthy();
    expect(estado.redirecionar).not.toHaveBeenCalled();
  });

  it("redireciona para o login sem sessão", async () => {
    await expect(AdminPage()).rejects.toThrow("redirecionado:/login");
    expect(estado.redirecionar).toHaveBeenCalledWith("/login");
  });

  it("redireciona para o login com cookie adulterado", async () => {
    const armazem = new ArmazemCookiesFake();
    usarArmazem(armazem);
    await iniciarSessaoAdmin(armazem);

    const original = armazem.get(NOME_COOKIE_SESSAO)?.value ?? "";
    const posicao = Math.floor(original.length / 2);
    armazem.definir(
      NOME_COOKIE_SESSAO,
      original.slice(0, posicao) +
        (original[posicao] === "a" ? "b" : "a") +
        original.slice(posicao + 1),
    );
    vi.spyOn(console, "warn").mockImplementation(() => {});

    await expect(AdminPage()).rejects.toThrow("redirecionado:/login");
    expect(estado.redirecionar).toHaveBeenCalledWith("/login");
  });

  it("redireciona para o login com cookie expirado", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const armazem = new ArmazemCookiesFake();
    usarArmazem(armazem);
    await iniciarSessaoAdmin(armazem);

    vi.setSystemTime(
      new Date(
        new Date("2026-01-01T00:00:00.000Z").getTime() +
          (DURACAO_SESSAO_SEGUNDOS + 61) * 1000,
      ),
    );

    await expect(AdminPage()).rejects.toThrow("redirecionado:/login");
    expect(estado.redirecionar).toHaveBeenCalledWith("/login");
  });

  it("redireciona para o login com sessão sem autenticação", async () => {
    const armazem = new ArmazemCookiesFake();
    usarArmazem(armazem);
    await iniciarSessaoAdmin(armazem);

    const sessao = await obterSessaoAdmin(armazem);
    sessao.autenticado = false;
    await sessao.save();

    await expect(AdminPage()).rejects.toThrow("redirecionado:/login");
    expect(estado.redirecionar).toHaveBeenCalledWith("/login");
  });

  it("falha fechado quando SESSION_SECRET está ausente", async () => {
    vi.stubEnv("SESSION_SECRET", "");

    await expect(AdminPage()).rejects.toThrow("redirecionado:/login");
    expect(estado.redirecionar).toHaveBeenCalledWith("/login");
  });
});
