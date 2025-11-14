import Image from "next/image";
import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import prisma from "@/lib/prisma";
import {Button} from "@/components/ui/button";
import {SignOutButton} from "@clerk/nextjs";
import { LogOut } from 'lucide-react';

export default async function DashboardHeader() {
    const user = await currentUser();
    if (!user) {
        redirect('/sign-in');
    }

    const displayName = user.firstName || "Użytkownik";
    const username = user.username || "Brak nazwy";

    let avatarUrl  = await prisma.profile.findUnique({
        where: { id: user.id,},
        select: { avatarUrl: true,},
    });

    if (!avatarUrl) {
        avatarUrl = {
            avatarUrl: 'https://zszww9q15dfion7m.public.blob.vercel-storage.com/avatars/default-avatar.png',
        };
    };

    return(
        <header className="backdrop backdrop-blur-lg ">
            <div className="flex items-center justify-center gap-2 p-4 border-b-1 w-full bg-black/60"
                 style={{
                     backgroundImage: `
                        repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
                        repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
                        radial-gradient(circle at 20px 20px, rgba(55, 65, 81, 0.12) 2px, transparent 2px),
                        radial-gradient(circle at 40px 40px, rgba(55, 65, 81, 0.12) 2px, transparent 2px)
                      `,
                     backgroundSize: '40px 40px, 40px 40px, 40px 40px, 40px 40px',
                 }}
            >
                <h1 className="text-3xl font-bold">Linkfloo</h1>
                <h2 className="text-2xl font-extralight"> / Dashboard</h2>
            </div>
            <div className="flex items-center justify-between gap-4 mb-10 p-6 border-b-1 w-full">
                <div className="flex items-center gap-4">
                    <Image
                    src={avatarUrl.avatarUrl}
                    width={300}
                    height={300}
                    alt="Your profile picture"
                    className="w-18 h-18 rounded-full object-cover">
                </Image>
                    <div>
                        <h1 className="text-2xl font-semibold">{displayName}</h1>
                        <p className="text-neutral-400 font-extralight">@{username}</p>
                    </div>
                </div>


                <SignOutButton redirectUrl="/">
                    <Button size="lg" className="
                    text-natural-100
                    font-semibold
                    border
                    border-red-400/30
                    bg-red-300/20
                    hover:cursor-pointer
                    hover:bg-red-600/20
                    hover:scale-[1.02]
                    transition
                    duration-200
            ">
                        Wyloguj się
                        <LogOut />
                    </Button>
                </SignOutButton>
            </div>
        </header>

    )
}