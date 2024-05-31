"use client";
import { trpc } from "@/app/_trpc/client";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    fileId: string;
  };
};

const page = ({ params }: Props) => {
  const { fileId } = params;

  const { data: file, isFetching } = trpc.getUserFile.useQuery({ id: fileId });

  if (isFetching) return <div>Loading...</div>;
  console.log(file);
  if (!file) return <div>File not found</div>;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-1 flex-col justify-between">
      <div className="mx-auto w-full max-w-7xl grow lg:flex xl:px-2">
        {/* left side */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6"></div>
        </div>
      </div>
    </div>
  );
};
export default page;
