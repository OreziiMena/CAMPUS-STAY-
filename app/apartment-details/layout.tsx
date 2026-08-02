import React from "react";
import { Metadata } from "next";
import prisma from "@/lib/prisma";

interface LayoutProps {
  children: React.ReactNode;
}

export async function generateMetadata(props: {
  searchParams?: Promise<{ id?: string }>;
}): Promise<Metadata> {
  try {
    const searchParams = props.searchParams ? await props.searchParams : null;
    const id = searchParams?.id;
    if (!id) return { title: "Apartment Details | Campus Stay" };

    const property = await prisma.property.findUnique({
      where: { id },
      select: { title: true, description: true, images: true, price: true },
    });

    if (!property) return { title: "Apartment Details | Campus Stay" };

    return {
      title: `${property.title} - ₦${property.price.toLocaleString()} | Campus Stay`,
      description: property.description.substring(0, 155),
      openGraph: {
        title: property.title,
        description: property.description.substring(0, 155),
        images: property.images.length > 0 ? [property.images[0]] : ["/icon.png"],
      },
    };
  } catch (e) {
    return { title: "Apartment Details | Campus Stay" };
  }
}

export default function ApartmentDetailsLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
