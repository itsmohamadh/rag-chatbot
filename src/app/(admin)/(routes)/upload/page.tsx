import { SignOutButton } from "@/components/layout/signout-button";
import { requireAuth } from "@/modules/auth/lib/helpers";
import { UploadView } from "@/modules/upload/ui/views/upload-view";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user, response } = await requireAuth(["admin"]);

  if (response) {
    redirect(`/login`);
  }

  return (
    <>
      <main className=" flex flex-col h-screen items-center justify-center">
        <UploadView />
      </main>
      <SignOutButton />
    </>
  );
}
