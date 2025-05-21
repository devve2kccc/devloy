"use client";
import { Button } from "@/components/ui/button";
import CardWrapper from "@/features/auth/components/card-wrapper";
import { authClient } from "@/lib/auth-client";
import { Github } from "lucide-react";

export default function LoginForm() {
  const signIn = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "http://localhost:3000",
    });
  };
  return (
    <CardWrapper
      header="Login"
      backButtonHref="/auth/sign-up"
      backButtonLabel="Dont have an account?"
    >
      <Button onClick={() => signIn()} className="mr-2">
        Login With Github
        <Github />
      </Button>
    </CardWrapper>
  );
}
