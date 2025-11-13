import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { AddLinkForm } from "./add-link-form.tsx";
import { deleteLink } from "@/lib/actions";
import { EditLinkDialog } from "@/app/dashboard/links/edit-link-dialog";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const user = await currentUser();
    if (!user) {
        redirect('/sign-in');
    }

    const profile = await prisma.profile.upsert({
        where: {id: user.id},
        update: {
            username: user.username || user.id,
            displayName: user.firstName || 'Nowy Użytkownik',
        },
        create: {
            id: user.id,
            username: user.username || user.id,
            displayName: user.firstName || 'Nowy Użytkownik',
        },
        include: {
            links: {
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    _count: {
                        select: { clicks: true }
                    }
                }
            }
        }
    });

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold">
                Cześć, {profile.displayName}!
            </h1>
            <p className="mt-2 text-neutral-400">
                Zarządzaj swoimi linkami.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">

                <div>
                    <AddLinkForm profileId={profile.id} />
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold">Twoje linki</h2>

                    {profile.links.length === 0 ? (
                        <p className="text-neutral-500">Nie masz jeszcze żadnych linków.</p>
                    ) : (
                        profile.links.map((link) => (
                            <div key={link.id} className="p-4 border rounded-lg flex justify-between items-center">
                                <EditLinkDialog link={link} />
                                <form action={deleteLink}>
                                    <input type="hidden" name="linkId" value={link.id} />
                                    <Button
                                        type="submit"
                                        variant="destructive" // Użyjemy wariantu z shadcn
                                        size="sm"
                                    >
                                        Usuń
                                    </Button>
                                </form>
                                <div>
                                    <h3 className="font-semibold">{link.title}</h3>
                                    <span
                                        className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-600 text-white"
                                        title="Liczba kliknięć"
                                    >
                                      {link._count.clicks}
                                    </span>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-neutral-400 hover:underline"
                                    >
                                        {link.url}
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );

}
