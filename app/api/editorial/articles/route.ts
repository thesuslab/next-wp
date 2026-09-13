import { NextResponse } from "next/server";
import { getAllKnowledgeEntries } from "@/lib/knowledge/data";
import { getStoredEditorialArticles } from "@/lib/editorial/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const all = getAllKnowledgeEntries();
    const editorialOnly = getStoredEditorialArticles();

    return NextResponse.json({
      success: true,
      totalCount: all.length,
      editorialCount: editorialOnly.length,
      articles: all,
      editorialArticles: editorialOnly,
    });
  } catch (err: any) {
    console.error("[/api/editorial/articles error]:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
