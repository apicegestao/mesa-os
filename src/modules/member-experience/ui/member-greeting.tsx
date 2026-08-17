"use client";

import { useEffect, useState } from "react";
import { memberGreeting } from "../domain/greeting";

export function MemberGreeting({ memberName, initialHour }: { memberName: string; initialHour?: number }) {
  const [hour, setHour] = useState(initialHour ?? 12);
  const firstName = memberName.trim().split(/\s+/)[0] || "membro";

  useEffect(() => {
    const update = () => setHour(new Date().getHours());
    update();
    const interval = window.setInterval(update, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return <>{memberGreeting(hour)}, {firstName}.</>;
}
