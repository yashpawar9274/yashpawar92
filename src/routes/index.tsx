import { createFileRoute } from "@tanstack/react-router";
import { Portfolio } from "@/components/portfolio/Portfolio";
import ogImage from "@/assets/og-home.jpg";

const TITLE = "Yash Pawar — Digital Marketing Executive Portfolio";
const DESCRIPTION =
  "Portfolio of Yash Pawar, Digital Marketing Executive with hands-on experience in real-estate digital marketing — Meta Ads, lead generation, content strategy, creatives, and AI-powered workflows.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/" },
      { property: "og:image", content: ogImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Index() {
  return <Portfolio />;
}
