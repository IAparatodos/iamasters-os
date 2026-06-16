import { plain } from "./format.js";

// Extract FAQ pairs from a page's FAQPage JSON-LD (RankMath/Yoast output it on
// the frontend). 100% public — no credentials, "info del frontend".
export function extractFaqFromHtml(html) {
  const re =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const faqs = [];
  let m;
  while ((m = re.exec(html))) {
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch {
      continue;
    }
    const nodes = Array.isArray(data) ? data : data["@graph"] || [data];
    for (const node of nodes) {
      const t = node?.["@type"];
      const isFaq = t === "FAQPage" || (Array.isArray(t) && t.includes("FAQPage"));
      if (!isFaq) continue;
      for (const q of node.mainEntity || []) {
        const answer = q.acceptedAnswer?.text ?? q.acceptedAnswer?.[0]?.text ?? "";
        faqs.push({ question: plain(q.name, 300), answer: plain(answer, 1200) });
      }
    }
  }
  return faqs;
}
