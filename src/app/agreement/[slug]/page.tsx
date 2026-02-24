import { notFound } from "next/navigation";
import { Redis } from "@upstash/redis";
import AgreementClient from "./AgreementClient";

export const dynamic = "force-dynamic";

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

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

async function getAgreement(slug: string): Promise<AgreementData | null> {
  const data = await redis.get<AgreementData>(`agreement:${slug}`);
  return data || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getAgreement(slug);
  if (!data) return { title: "Agreement Not Found" };
  return {
    title: `Service Agreement — ${data.businessName}`,
    robots: { index: false, follow: false },
  };
}

export default async function AgreementPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getAgreement(slug);
  if (!data) notFound();

  return <AgreementClient data={data} />;
}
