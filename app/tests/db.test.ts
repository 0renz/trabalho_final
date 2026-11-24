import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@libsql/client";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as schema from "../src/db/schema";

function criarBanco(caminho: string) {
  const client = createClient({ url: `file:${caminho}` });
  return { client, db: drizzle(client, { schema }) };
}

const pastaMigrations = fileURLToPath(
  new URL("../src/db/migrations", import.meta.url),
);

let diretorio: string;
let banco: ReturnType<typeof criarBanco>;

beforeAll(async () => {
  diretorio = mkdtempSync(join(tmpdir(), "semana-academica-"));
  banco = criarBanco(join(diretorio, "teste.db"));

  await migrate(banco.db, { migrationsFolder: pastaMigrations });
});

afterAll(() => {
  banco.client.close();
  rmSync(diretorio, { recursive: true, force: true });
});

async function criarEvento(nome = "Semana de Teste", cargaHoraria = 20) {
  const [evento] = await banco.db
    .insert(schema.eventos)
    .values({
      nome,
      dataInicio: "2026-11-23",
      dataFim: "2026-11-27",
      cargaHoraria,
      publicado: true,
    })
    .returning();

  return evento;
}

describe("schema do banco", () => {
  it("grava e lê evento e inscrição", async () => {
    const evento = await criarEvento();
    await banco.db.insert(schema.inscricoes).values({
      eventoId: evento.id,
      nome: "Ana Souza",
      email: "ana@example.com",
      codigoCertificado: "codigo-ana",
    });

    const [inscricao] = await banco.db
      .select()
      .from(schema.inscricoes)
      .where(eq(schema.inscricoes.codigoCertificado, "codigo-ana"));

    expect(inscricao).toBeDefined();
    expect(inscricao?.nome).toBe("Ana Souza");
    expect(inscricao?.presente).toBe(false);
    expect(inscricao?.presenteEm).toBeNull();
  });

  it("impede e-mail duplicado no mesmo evento, ignorando maiúsculas", async () => {
    const evento = await criarEvento("Evento com duplicidade");

    await banco.db.insert(schema.inscricoes).values({
      eventoId: evento.id,
      nome: "Bruno Lima",
      email: "bruno@example.com",
      codigoCertificado: "codigo-bruno",
    });

    await expect(
      banco.db.insert(schema.inscricoes).values({
        eventoId: evento.id,
        nome: "Bruno Lima",
        email: "BRUNO@EXAMPLE.COM",
        codigoCertificado: "codigo-bruno-2",
      }),
    ).rejects.toThrow();
  });

  it("impede código de certificado duplicado entre eventos", async () => {
    const primeiroEvento = await criarEvento("Evento A");
    const segundoEvento = await criarEvento("Evento B");

    await banco.db.insert(schema.inscricoes).values({
      eventoId: primeiroEvento.id,
      nome: "Elisa Rocha",
      email: "elisa@example.com",
      codigoCertificado: "codigo-repetido",
    });

    await expect(
      banco.db.insert(schema.inscricoes).values({
        eventoId: segundoEvento.id,
        nome: "Fábio Nunes",
        email: "fabio@example.com",
        codigoCertificado: "codigo-repetido",
      }),
    ).rejects.toThrow();
  });

  it("permite o mesmo e-mail em eventos diferentes", async () => {
    const primeiroEvento = await criarEvento("Primeiro evento");
    const segundoEvento = await criarEvento("Segundo evento");

    await banco.db.insert(schema.inscricoes).values({
      eventoId: primeiroEvento.id,
      nome: "Carla Dias",
      email: "carla@example.com",
      codigoCertificado: "codigo-carla-1",
    });
    await banco.db.insert(schema.inscricoes).values({
      eventoId: segundoEvento.id,
      nome: "Carla Dias",
      email: "carla@example.com",
      codigoCertificado: "codigo-carla-2",
    });

    const registros = await banco.db
      .select()
      .from(schema.inscricoes)
      .where(eq(schema.inscricoes.email, "carla@example.com"));

    expect(registros).toHaveLength(2);
  });

  it("exige data de presença ao marcar presença", async () => {
    const evento = await criarEvento("Evento de presença");
    const [inscricao] = await banco.db
      .insert(schema.inscricoes)
      .values({
        eventoId: evento.id,
        nome: "Diego Alves",
        email: "diego@example.com",
        codigoCertificado: "codigo-diego",
      })
      .returning();

    await expect(
      banco.db
        .update(schema.inscricoes)
        .set({ presente: true })
        .where(eq(schema.inscricoes.id, inscricao.id)),
    ).rejects.toThrow();

    await banco.db
      .update(schema.inscricoes)
      .set({ presente: true, presenteEm: new Date().toISOString() })
      .where(eq(schema.inscricoes.id, inscricao.id));

    const [atualizada] = await banco.db
      .select()
      .from(schema.inscricoes)
      .where(eq(schema.inscricoes.id, inscricao.id));

    expect(atualizada?.presente).toBe(true);
    expect(atualizada?.presenteEm).not.toBeNull();

    await expect(
      banco.db
        .update(schema.inscricoes)
        .set({ presente: false, presenteEm: new Date().toISOString() })
        .where(eq(schema.inscricoes.id, inscricao.id)),
    ).rejects.toThrow();

    await banco.db
      .update(schema.inscricoes)
      .set({ presente: false, presenteEm: null })
      .where(eq(schema.inscricoes.id, inscricao.id));

    const [desmarcada] = await banco.db
      .select()
      .from(schema.inscricoes)
      .where(eq(schema.inscricoes.id, inscricao.id));

    expect(desmarcada?.presente).toBe(false);
    expect(desmarcada?.presenteEm).toBeNull();
  });

  it("aceita carga horária nos limites permitidos", async () => {
    const eventoMinimo = await criarEvento("Evento de 1 hora", 1);
    const eventoMaximo = await criarEvento("Evento de 200 horas", 200);

    expect(eventoMinimo.cargaHoraria).toBe(1);
    expect(eventoMaximo.cargaHoraria).toBe(200);
  });

  it("rejeita carga horária inválida", async () => {
    for (const cargaHoraria of [0, 201]) {
      await expect(
        banco.db.insert(schema.eventos).values({
          nome: `Evento inválido (${cargaHoraria}h)`,
          dataInicio: "2026-11-23",
          cargaHoraria,
        }),
      ).rejects.toThrow();
    }
  });
});
