import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AddLinkForm } from "./add-link-form";
import { Button } from "@/components/ui/button";
import { LinksList } from "./links-list";
import Link from "next/link";

export const dynamic = 'force-dynamic'; // Always use dynamic rendering for this page and not cache it

// LINKS MANAGEMENT PAGE COMPONENT
// Renders the main dashboard page for managing user links and its order

export default async function LinksPage() {
    const user = await currentUser(); // Get the currently logged-in user from Clerk

    if (!user) {
        redirect('/sign-in');
    }

    // Fetch or create the user's profile in the database
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
                    order: 'asc',
                },
                include: {
                    _count: { // This is click count for each link
                        select: { clicks: true }
                    }
                }
            }
        }
    });

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">

            <Button asChild variant="ghost" className="mb-4">
                <Link href="/dashboard">{"<"} Wróć do dashboardu</Link>
            </Button>


            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    Zarządzaj linkami
                </h1>

                <AddLinkForm />
            </header>


            <LinksList initialLinks={profile.links} />
        </div>
    );

}
