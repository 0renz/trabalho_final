import { sql } from "drizzle-orm";
import { db } from "@/db/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.get(sql`select 1 as ok`);
    return Response.json({ status: "ok", banco: "ok" });
  } catch (erro) {
    console.error("Falha no health check do banco:", erro);
    return Response.json(
      { status: "erro", banco: "indisponivel" },
      { status: 503 },
    );
  }
}
