"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { trpc } from "../_trpc/client";
import { Loader2 } from "lucide-react";

const Page = () => {
  const params = useSearchParams();
  const router = useRouter();

  const origin = params.get("origin");

  const { data, isError, error } = trpc.authCallback.useQuery(undefined, {
    retry: false,
    retryDelay: 500,
  });

  if (isError) {
    if (error?.data?.code === "UNAUTHORIZED") router.push("/sign-in");
  }
  if (data?.success) {
    // user is synced to db
    router.push(origin ? `/${origin}` : "/dashboard");
  }

  return (
    <div className="mt-24 flex w-full justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="text-xl font-semibold">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
