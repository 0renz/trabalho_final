CREATE TABLE `eventos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`descricao` text,
	`data_inicio` text NOT NULL,
	`data_fim` text,
	`carga_horaria` integer NOT NULL,
	`local` text,
	`responsavel_nome` text,
	`publicado` integer DEFAULT false NOT NULL,
	`criado_em` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	CONSTRAINT "eventos_carga_horaria_check" CHECK("eventos"."carga_horaria" BETWEEN 1 AND 200),
	CONSTRAINT "eventos_periodo_check" CHECK("eventos"."data_fim" IS NULL OR "eventos"."data_fim" >= "eventos"."data_inicio")
);
--> statement-breakpoint
CREATE TABLE `inscricoes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`evento_id` integer NOT NULL,
	`nome` text NOT NULL,
	`email` text NOT NULL,
	`instituicao` text,
	`presente` integer DEFAULT false NOT NULL,
	`presente_em` text,
	`codigo_certificado` text NOT NULL,
	`criado_em` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`evento_id`) REFERENCES `eventos`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "inscricoes_presente_em_check" CHECK(("inscricoes"."presente" = 0 AND "inscricoes"."presente_em" IS NULL) OR ("inscricoes"."presente" = 1 AND "inscricoes"."presente_em" IS NOT NULL))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `inscricoes_codigo_certificado_unique` ON `inscricoes` (`codigo_certificado`);--> statement-breakpoint
CREATE UNIQUE INDEX `ux_inscricoes_evento_email` ON `inscricoes` (`evento_id`,lower("email"));--> statement-breakpoint
CREATE INDEX `ix_inscricoes_evento` ON `inscricoes` (`evento_id`);