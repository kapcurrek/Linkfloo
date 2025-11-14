import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EditDisplayNameModal } from "./edit-display-name-modal";
import { EditUsernameModal } from "@/app/dashboard/personalizuj/edit-username-modal";
import { EditAccentColorModal } from "@/app/dashboard/personalizuj/edit-accent-color-modal";
import { EditAvatarModal } from "@/app/dashboard/personalizuj/edit-avatar-modal";
import Image from "next/image";
import DashboardHeader from "@/app/dashboard/dashboard-header";

export const dynamic = 'force-dynamic';

export default async function PersonalizujPage() {

    const user = await currentUser();
    if (!user) redirect('/sign-in');

    // Fetch profile data from the database
    const profile = await prisma.profile.findUnique({
        where: { id: user.id },
    });

    if (!profile) return <div>Błąd: Nie znaleziono profilu.</div>;


    return (
        <div className="bg-neutral-950 text-white min-h-screen relative bg-black" style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249, 115, 22, 0.25), transparent 70%), #000000",
        }}>

            <DashboardHeader />

            <div className="gap-4 mb-8 m pr-10 pl-10 max-w-[1200px]">

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

            <h1 className="text-3xl font-bold mb-10">
                Personalizuj swój profil
            </h1>

            <div className="flex flex-col gap-4">

                <div className="flex justify-between items-center p-4 border rounded-lg backdrop-blur-xl bg-gradient-to-tl from-transparent via-transparent via-40% to-slate-100/6">
                    <div>
                        <p className="font-semibold">Nazwa profilu</p>
                        <p className="text-sm text-neutral-400">{profile.displayName}</p>
                    </div>

                    <EditDisplayNameModal currentName={profile.displayName || ''} />
                </div>


                <div className="flex justify-between items-center p-4 border rounded-lg backdrop-blur-xl bg-gradient-to-tl from-transparent via-transparent via-40% to-slate-100/6">
                    <div>
                        <p className="font-semibold">Nazwa użytkownika</p>
                        <p className="text-sm text-neutral-400">@{profile.username}</p>
                    </div>

                    <EditUsernameModal currentUsername={profile.username || ''} />
                </div>


                <div className="flex justify-between items-center p-4 border rounded-lg backdrop-blur-xl bg-gradient-to-tl from-transparent via-transparent via-40% to-slate-100/6">
                    <div>
                        <p className="font-semibold">Kolor akcentu</p>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: profile.accentColor || '#3b82f6' }}
                            />
                            <p className="text-sm text-neutral-400">{profile.accentColor || "Domyślny"}</p>
                        </div>
                    </div>

                    <EditAccentColorModal currentAccentColor={profile.accentColor || ''} />
                </div>

                <div className="flex justify-between items-center p-4 border rounded-lg backdrop-blur-xl bg-gradient-to-tl from-transparent via-transparent via-40% to-slate-100/6">
                    <div>
                        <p className="font-semibold">Avatar</p>
                        <div className="w-16 h-16 rounded-full bg-neutral-700 mt-2 overflow-hidden relative">
                            {profile.avatarUrl && (
                                <Image
                                    src={profile.avatarUrl}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>
                    </div>

                    <EditAvatarModal currentAvatar={profile.avatarUrl} />
                </div>
                </div>
            </div>
        </div>
    );
}