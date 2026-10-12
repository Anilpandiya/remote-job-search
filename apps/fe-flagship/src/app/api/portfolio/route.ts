import { NextResponse } from "next/server";
import { mockPortfolio } from "@/lib/data/mock-portfolio";

export async function GET() {
  // Simulate a light network hop so loading states are exercisable in demos.
  await new Promise((resolve) => setTimeout(resolve, 180));
  return NextResponse.json(mockPortfolio);
}
