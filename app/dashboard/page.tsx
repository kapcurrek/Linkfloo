import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./logout-button";
import { UserButton } from "@clerk/nextjs";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const user = await currentUser();
    if (!user) {
        redirect('/sign-in');
    }

    const displayName = user.firstName || "Użytkownik";
    const username = user.username || "Brak nazwy";

    return (
        <div className="bg-neutral-900 text-white min-h-screen p-4">

            <div className="max-w-sm mx-auto">

                <header className="flex items-center justify-center gap-4 mb-10">

                    <UserButton appearance={{
                                elements: {
                                    avatarBox:
                                        {
                                            height: '50px',
                                            width: '50px',
                                        },
                                },
                    }} afterSignOutUrl="/" />

                    <div>
                        <h1 className="text-2xl font-bold">{displayName}</h1>
                        <p className="text-neutral-400">@{username}</p>
                    </div>
                </header>

                <main className="grid grid-cols-2 gap-4 mb-8">

                    <Button asChild className="aspect-video h-auto text-lg p-6">
                        <Link href="/dashboard/links">Linki</Link>
                    </Button>

                    <Button asChild className="aspect-video h-auto text-lg p-6" variant="secondary">
                        <Link href="#">Analityka</Link>
                    </Button>

                    <Button asChild className="aspect-video h-auto text-lg p-6" variant="secondary">
                        <Link href="/dashboard/personalizuj">Personalizuj</Link>
                    </Button>

                    <Button asChild className="aspect-video h-auto text-lg p-6">
                        <Link href="/user-profile">Ustawienia</Link>
                    </Button>
                </main>

                <footer>
                    <LogoutButton />
                </footer>

            </div>
        </div>
    );
}