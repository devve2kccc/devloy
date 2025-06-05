import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";

interface CardWrapperProps {
  header: string;
  description?: string | null;
  children: ReactNode;
}

export default function CardWrapper({
  header,
  description,
  children,
}: CardWrapperProps) {
  return (
    <Card className="w-full transition-colors duration-300 bg-background hover:bg-primary/80">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{header}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
