import { FoundationStatus } from "@/modules/foundation/ui/foundation-status";
import Link from "next/link";

export default function Home() {
  return (
    <main className="shell">
      <FoundationStatus />
      <Link className="access-link" href="/login">Acessar com convite</Link>
    </main>
  );
}
