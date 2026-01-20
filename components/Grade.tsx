"use client";

import { usePathname } from "next/navigation";
import EnGrade from "./EnGrade";
import RuGrade from "./RuGrade";

export default function Grade({ sessionId }: { sessionId: string }) {
  const pathname = usePathname();
  const isRussian = pathname.startsWith("/ru");

  return isRussian ? (
    <RuGrade sessionId={sessionId} />
  ) : (
    <EnGrade sessionId={sessionId} />
  );
}
