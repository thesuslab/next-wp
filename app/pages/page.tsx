import { getAllPages } from "@/lib/wordpress";
import { ArchiveList } from "@/components/archive-list";
import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Page as WPPage } from "@/lib/wordpress.d";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = createPageMetadata({
  title: "Site Directory & All Pages",
  description: "Browse all institutional pages, directories, and policies of the Sustainability Lab.",
  path: "/pages",
});

export default async function Page() {
  const pages = await getAllPages();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "All Pages", url: "/pages" },
        ]}
      />
      <ArchiveList<WPPage>
        title="All Pages"
        items={pages}
        getItemHref={(p) => `/pages/${p.slug}`}
        getItemLabel={(p) => p.title.rendered}
        emptyMessage="No pages available yet."
      />
    </>
  );
}
