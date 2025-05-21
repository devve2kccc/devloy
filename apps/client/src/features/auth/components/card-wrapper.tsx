import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ReactNode } from 'react';

interface CardWrapperProps {
  header: string;
  backButtonHref: string;
  backButtonLabel: string;
  children: ReactNode;
}

export default function CardWrapper({
  header,
  backButtonHref,
  backButtonLabel,
  children,
}: CardWrapperProps) {
  return (
    <Card className="max-w-[450px]">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">{header}</CardTitle>
      </CardHeader>
      <CardContent className="mx-auto">{children}</CardContent>
      <CardFooter>
        <Button variant="ghost" asChild>
          <Link href={backButtonHref}>{backButtonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
