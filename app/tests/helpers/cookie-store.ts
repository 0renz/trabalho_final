import type { CookieStore } from "iron-session";

export class ArmazemCookiesFake implements CookieStore {
  private readonly valores = new Map<string, string>();
  public readonly opcoes = new Map<
    string,
    Parameters<CookieStore["set"]>[2]
  >();

  get(nome: string) {
    const valor = this.valores.get(nome);
    return valor === undefined ? undefined : { name: nome, value: valor };
  }

  set(
    nome: string,
    valor: string,
    cookie: Parameters<CookieStore["set"]>[2],
  ) {
    this.opcoes.set(nome, cookie);

    if (cookie.maxAge === 0) {
      this.valores.delete(nome);
    } else {
      this.valores.set(nome, valor);
    }

    return this;
  }

  delete(nome: string) {
    this.valores.delete(nome);
  }

  definir(nome: string, valor: string) {
    this.valores.set(nome, valor);
  }
}
