import { createFileRoute } from "@tanstack/react-router";
import { Portfolio } from "@/components/portfolio/Portfolio";

const SITE_URL = "https://dmyashpawar.vercel.app";
const OG_IMAGE = `${SITE_URL}/og-home.jpg`;

const TITLE = "Yash Pawar — Digital Marketing Executive Portfolio";
const DESCRIPTION =
  "Portfolio of Yash Pawar, Digital Marketing Executive with 2.5+ years of experience in lead generation, Meta Ads, content strategy, creative design, and AI-powered workflows — proven in real estate and ready for B2C, services, and product brands.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:site_name", content: "Yash Pawar" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:secure_url", content: OG_IMAGE },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: TITLE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
  }),
});


function Index() {
  return <Portfolio />;
}
