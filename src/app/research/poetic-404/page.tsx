import { Metadata } from "next";
import PageResearch from "@/components/PageResearch";
import { parseResearchPostContent } from "@/lib/parseResearchPostContent";
import { getLatestCommitHash } from "@/lib/build-info";
import { getPageMetadata } from "@/utils/metadata";
import content from "./content.md";
import Prototype from "./Prototype";

export async function generateMetadata(): Promise<Metadata> {
  const post = parseResearchPostContent(content);
  return getPageMetadata(post.frontmatter);
}

export default async function Page() {
  const post = parseResearchPostContent(content);
  const commitHash = await getLatestCommitHash();

  return PageResearch({
    post,
    prototype: <Prototype />,
    commitHash,
  });
}
