"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { ActionState } from "@/lib/admin/actions";
import { Banner, SubmitButton } from "./ui";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending}>{label}</SubmitButton>;
}

export function AdminForm({
  action,
  children,
  submitLabel = "Save",
  hidden,
}: {
  action: (state: ActionState, fd: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  submitLabel?: string;
  hidden?: Record<string, string>;
}) {
  const [state, formAction] = useActionState(action, {});
  return (
    <form action={formAction} className="space-y-5">
      {hidden &&
        Object.entries(hidden).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
      {state.error && <Banner kind="error">{state.error}</Banner>}
      {state.ok && <Banner kind="success">{state.message}</Banner>}
      {children}
      <div className="pt-2">
        <Submit label={submitLabel} />
      </div>
    </form>
  );
}
