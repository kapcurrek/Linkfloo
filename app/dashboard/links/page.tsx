import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AddLinkForm } from "./add-link-form";
import { Button } from "@/components/ui/button";
import { LinksList } from "./links-list";
import Link from "next/link";
import DashboardHeader from "../dashboard-header";
import {LogOut} from "lucide-react";

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
        <div className="bg-neutral-950 text-white min-h-screen relative bg-black" style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249, 115, 22, 0.25), transparent 70%), #000000",
        }}>
            <DashboardHeader />

                    <main className=" gap-4 mb-8 m pr-10 pl-10 max-w-[1200px]">

                        <Button size="lg" className="
                            p-0
                            text-natural-100
                            font-semibold
                            bg-transparent
                            hover:bg-transparent
                            hover:cursor-pointer
                            hover:scale-[1.08]
                            hover:text-orange-400
                            transition
                            duration-200
                            mb-6
                            ">
                            <Link href="/dashboard">{"<"} Wróć do dashboardu</Link>
                        </Button>


                        <div className="flex justify-between items-end mb-12">
                            <div className="mb-">
                                <h1 className="text-3xl font-bold">
                                    Zarządzaj swoimi linkami
                                </h1>

                                <p className="mt-4 font-extralight text-sm leading-5 block text-justify max-w-[400px]">
                                    Witaj w centrum zarządzania linkami! Tutaj możesz dodawać, edytować i usuwać swoje linki, a także zmieniać ich kolejność wyświetlania na Twojej stronie profilowej.
                                </p>
                            </div>

                            <AddLinkForm />
                        </div>


                        <LinksList initialLinks={profile.links} />
                    </main>

        </div>


    );
}
