import PageResearch from "@/components/PageResearch";
import Prototype from "./Prototype";
import { parseResearchPostContent } from "@/lib/parseResearchPostContent";
import { getLatestCommitHash } from "@/lib/build-info";
import content from "./content.md";

export default async function CollectionsOfMeaninglessWordsPage() {
  const post = parseResearchPostContent(content);
  const commitHash = await getLatestCommitHash();

  return PageResearch({
    post,

    prototype: <Prototype />,
    commitHash,
  });
}
