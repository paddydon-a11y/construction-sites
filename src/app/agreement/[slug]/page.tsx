import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import AgreementClient from "./AgreementClient";

interface AgreementData {
  slug: string;
  clientName: string;
  businessName: string;
  email: string;
  phone: string;
  date: string;
  monthlyFee: string;
  signed: boolean;
}

function getAgreement(slug: string): AgreementData | null {
  const filePath = path.join(process.cwd(), "data", "agreements", `${slug}.json`);
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "data", "agreements");
  try {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
    return files.map((f) => ({ slug: f.replace(".json", "") }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getAgreement(slug);
  if (!data) return { title: "Agreement Not Found" };
  return {
    title: `Service Agreement — ${data.businessName}`,
    robots: { index: false, follow: false },
  };
}

export default async function AgreementPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getAgreement(slug);
  if (!data) notFound();

  return <AgreementClient data={data} />;
}
