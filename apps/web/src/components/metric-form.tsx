import { zodResolver } from "@hookform/resolvers/zod";
import { CreateMetricSchema } from "@metrifacts/api/schema";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateMetric } from "@/hooks/use-metrics";

type MetricFormProps = {
  onCancel?: () => void;
  onSuccess?: () => void;
};

export function MetricForm({ onCancel, onSuccess }: MetricFormProps) {
  const form = useForm<CreateMetricSchema>({
    resolver: zodResolver(CreateMetricSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "general",
    },
  });

  const createMutation = useCreateMetric({
    onSuccess: () => {
      form.reset();
      onSuccess?.();
    },
  });

  return (
    <Form {...form}>
      <form
        className="space-y-4 pt-4"
        onSubmit={form.handleSubmit((data) => createMutation.mutate(data))}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Daily active users" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="pt-4">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            disabled={
              createMutation.isPending ||
              form.formState.isSubmitting ||
              (form.formState.isSubmitted && !form.formState.isValid)
            }
          >
            {createMutation.isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export function AddMetricButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Add metric
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new metric</DialogTitle>
          <DialogDescription>
            Create a new metric to track your data points over time.
          </DialogDescription>
        </DialogHeader>

        <MetricForm
          onCancel={() => setOpen(false)}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
