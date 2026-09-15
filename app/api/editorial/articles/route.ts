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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, body: bodyText, summary, topic, category, tags, source } = body;

    if (!title || (!content && !bodyText)) {
      return NextResponse.json(
        { success: false, error: "Title and content/body are required." },
        { status: 400 }
      );
    }

    const { indexArticleIntoKnowledge } = await import("@/lib/knowledge/indexer");

    const indexed = indexArticleIntoKnowledge({
      title,
      body: content || bodyText,
      summary,
      topic,
      category,
      tags: Array.isArray(tags) ? tags : undefined,
      source,
    });

    return NextResponse.json({
      success: true,
      message: "Article published and successfully indexed into Sustainable AI Advisor.",
      article: indexed,
    });
  } catch (err: any) {
    console.error("[/api/editorial/articles POST error]:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

