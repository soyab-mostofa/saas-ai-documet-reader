"use client";
import { useState } from "react";
import UploadButton from "./UploadButton";
import { trpc } from "@/app/_trpc/client";
import { GhostIcon, Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: files, isLoading } = trpc.getUserFiles.useQuery();
  const { mutate: deleteFile } = trpc.deleteUserFile.useMutation({
    onSuccess: ({ success }) => {
      if (success) {
        utils.getUserFiles.invalidate();
      }
    },
    onMutate: ({ id }) => {
      setCurrentFile(id);
    },
    onSettled: () => {
      setCurrentFile(null);
    },
  });

  const { mutate: recycleFile } = trpc.recycleFile.useMutation({
    onSuccess: ({ success }) => {
      if (success) {
        utils.getUserFiles.invalidate();
      }
    },
    onMutate: ({ id }) => {
      setCurrentFile(id);
    },
    onSettled: () => {
      setCurrentFile(null);
    },
  });

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 text-5xl font-bold text-gray-900">My files</h1>
        <UploadButton />
      </div>

      {/* display all user files */}

      {files && files.length !== 0 ? (
        <ul className="grid grid-cols-1 gap-6 divide-y divide-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-zinc-200 rounded-lg bg-white shadow transition hover:shadow-lg"
              >
                <Link
                  href={`/dashboard/${file.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="flex w-full items-center justify-between space-x-6 px-6 pt-6">
                    <div className="size-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 "></div>
                    <div className="flex-1 truncate">
                      <div className="truncate text-lg font-medium text-zinc-900">
                        {file.name}
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="mt-4 grid grid-cols-3 place-items-center gap-6 px-6 py-2 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {format(new Date(file.createdAt), "MMM dd, yyyy")}
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    mocked
                  </div>
                  <Button
                    onClick={() => {
                      setCurrentFile(file.id);
                      recycleFile({ id: file.id });
                    }}
                    size={"sm"}
                    className="w-full"
                  >
                    {currentFile === file.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} className="my-2" count={3} />
      ) : (
        <div className="mt-16 flex flex-col items-center justify-center gap-2">
          <GhostIcon className="h-8 w-8 text-zinc-600" />
          <h1 className="text-xl font-semibold">Pretty empty around here.</h1>
          <p>Let's get started by uploading a PDF.</p>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
