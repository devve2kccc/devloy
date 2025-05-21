"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ProjectSchema } from "@db/prisma/generated/zod";

const ProjectType = ProjectSchema.pick({
  name: true,
  description: true,
}).extend({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

interface ProjectFormProps {
  id?: string;
  defaultValues?: z.input<typeof ProjectType>;
  onSubmit: (values: z.input<typeof ProjectType>) => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export function NewProjectForm({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: ProjectFormProps) {
  const form = useForm<z.infer<typeof ProjectType>>({
    resolver: zodResolver(ProjectType),
    defaultValues: defaultValues,
  });

  function handleSubmit(values: z.infer<typeof ProjectType>) {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormDescription>This is your project name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormDescription>
                This is your project description.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={disabled}>
          {disabled ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
