import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

const criadoEm = sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`;

export const eventos = sqliteTable(
  "eventos",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    nome: text("nome").notNull(),
    descricao: text("descricao"),
    dataInicio: text("data_inicio").notNull(),
    dataFim: text("data_fim"),
    cargaHoraria: integer("carga_horaria").notNull(),
    local: text("local"),
    responsavelNome: text("responsavel_nome"),
    publicado: integer("publicado", { mode: "boolean" })
      .notNull()
      .default(false),
    criadoEm: text("criado_em").notNull().default(criadoEm),
  },
  (tabela) => [
    check(
      "eventos_carga_horaria_check",
      sql`${tabela.cargaHoraria} BETWEEN 1 AND 200`,
    ),
    check(
      "eventos_periodo_check",
      sql`${tabela.dataFim} IS NULL OR ${tabela.dataFim} >= ${tabela.dataInicio}`,
    ),
  ],
);

export const inscricoes = sqliteTable(
  "inscricoes",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    eventoId: integer("evento_id")
      .notNull()
      .references(() => eventos.id, { onDelete: "restrict" }),
    nome: text("nome").notNull(),
    email: text("email").notNull(),
    instituicao: text("instituicao"),
    presente: integer("presente", { mode: "boolean" })
      .notNull()
      .default(false),
    presenteEm: text("presente_em"),
    codigoCertificado: text("codigo_certificado").notNull().unique(),
    criadoEm: text("criado_em").notNull().default(criadoEm),
  },
  (tabela) => [
    uniqueIndex("ux_inscricoes_evento_email").on(
      tabela.eventoId,
      sql`lower(${tabela.email})`,
    ),
    index("ix_inscricoes_evento").on(tabela.eventoId),
    check(
      "inscricoes_presente_em_check",
      sql`(${tabela.presente} = 0 AND ${tabela.presenteEm} IS NULL) OR (${tabela.presente} = 1 AND ${tabela.presenteEm} IS NOT NULL)`,
    ),
  ],
);

export type Evento = typeof eventos.$inferSelect;
export type NovaInscricao = typeof inscricoes.$inferInsert;
export type Inscricao = typeof inscricoes.$inferSelect;
