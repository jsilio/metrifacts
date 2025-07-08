import { zodResolver } from "@hookform/resolvers/zod";
import { CreateMetricEntrySchema, type Metric } from "@metrifacts/api/schema";
import { format, parseISO } from "date-fns";
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
import { useCreateMetricEntry } from "@/hooks/use-entries";

type AddEntryFormProps = {
  metric: Metric;
  onCancel?: () => void;
  onSuccess?: () => void;
};

export function AddEntryForm({
  metric,
  onCancel,
  onSuccess,
}: AddEntryFormProps) {
  const form = useForm<CreateMetricEntrySchema>({
    resolver: zodResolver(CreateMetricEntrySchema),
    defaultValues: {
      value: 1,
      timestamp: new Date().toISOString(),
      metricId: metric.id,
    },
  });

  const createMutation = useCreateMetricEntry({
    onSuccess: () => {
      form.reset();
      onSuccess?.();
    },
  });

  return (
    <Form {...form}>
      <form
        className="space-y-6 pt-4"
        onSubmit={form.handleSubmit((data) =>
          createMutation.mutate({ ...data, metricId: metric.id })
        )}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Value
                {metric.unit && (
                  <span className="text-muted-foreground">({metric.unit})</span>
                )}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter value"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timestamp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timestamp</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  value={format(parseISO(field.value), "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) =>
                    field.onChange(
                      new Date(e.target.value || Date.now()).toISOString()
                    )
                  }
                />
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
            disabled={createMutation.isPending || form.formState.isSubmitting}
          >
            {createMutation.isPending ? "Adding..." : "Add entry"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export function AddEntryButton({ metric }: { metric: Metric }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon />
          Add entry
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new entry</DialogTitle>
          <DialogDescription>
            Add a new data point to {metric.name}.
          </DialogDescription>
        </DialogHeader>

        <AddEntryForm
          metric={metric}
          onCancel={() => setOpen(false)}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
