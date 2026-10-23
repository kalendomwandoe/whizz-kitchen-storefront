"use client";

import { useEffect } from "react";
import PageBand from "@/components/ui/PageBand";
import Button from "@/components/ui/Button";
import LinkButton from "@/components/ui/LinkButton";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  // Leave a trace in the browser console so the problem can be found later
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    // role="alert" makes screen readers announce the change straight away
    <div role="alert">
      <PageBand
        narrow
        title="Something went wrong"
        text="That page didn't load properly. Please try again."
      >
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => retry()}>Try again</Button>
          <LinkButton href="/" variant="secondary">
            Go to the home page
          </LinkButton>
        </div>
      </PageBand>
    </div>
  );
}