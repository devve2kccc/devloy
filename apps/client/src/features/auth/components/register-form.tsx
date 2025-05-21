"use client";
import { Button } from "@/components/ui/button";
import CardWrapper from "@/features/auth/components/card-wrapper";
import { authClient } from "@/lib/auth-client";
import { Github } from "lucide-react";

export default function RegisterForm() {
  const signUp = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "http://localhost:3000/",
    });
  };
  return (
    <CardWrapper
      header="Register"
      backButtonHref="/auth/sign-in"
      backButtonLabel="Already have an account?"
    >
      <Button onClick={() => signUp()} className="mr-2">
        Login With Github
        <Github />
      </Button>
    </CardWrapper>
  );
}
