import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mesa OS",
    short_name: "Mesa OS",
    description: "Sistema de evolução empresarial Mesa dos Donos.",
    start_url: "/app",
    display: "standalone",
    background_color: "#101D37",
    theme_color: "#101D37",
    icons: [
      { src: "/icon.png?v=4", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon.png?v=4", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
