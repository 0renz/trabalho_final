import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

function criarBanco() {
  const url = process.env.DATABASE_URL ?? "file:local.db";
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  const client = createClient({
    url,
    ...(authToken ? { authToken } : {}),
  });

  return drizzle(client, { schema });
}

type Banco = ReturnType<typeof criarBanco>;

const globalComBanco = globalThis as typeof globalThis & {
  __bancoSemanaAcademica?: Banco;
};

export const db = globalComBanco.__bancoSemanaAcademica ?? criarBanco();

if (process.env.NODE_ENV !== "production") {
  globalComBanco.__bancoSemanaAcademica = db;
}
