import { db } from "./client";
import { eventos } from "./schema";

const eventoSemanaAcademica = {
  nome: "Semana Acadêmica de Computação 2026",
  descricao: "Evento fictício usado para validar o MVP.",
  dataInicio: "2026-11-23",
  dataFim: "2026-11-27",
  cargaHoraria: 20,
  local: "IFSul - Campus Passo Fundo",
  responsavelNome: "Coordenação do Curso",
  publicado: true,
};

async function main() {
  const existentes = await db.select({ id: eventos.id }).from(eventos).limit(1);

  if (existentes.length > 0) {
    console.log("O banco já possui eventos; seed não alterou nada.");
    return;
  }

  await db.insert(eventos).values(eventoSemanaAcademica);
  console.log("Evento fictício criado.");
}

main().catch((erro) => {
  console.error("Falha ao executar o seed:", erro);
  process.exit(1);
});
