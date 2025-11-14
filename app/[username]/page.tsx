import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { TrackedLinkButton } from "./TrackedLinkButton";


async function getProfile(username: string) {

    const profile = await prisma.profile.findUnique({
        where: {
            username: username,
        },
        include: {
            links: {
                orderBy: {
                    order: 'asc',
                }
            }
        }
    });

    if (!profile) {
        notFound();
    }

    return profile;
}


// Probably because I use Clerk's middleware, `params` as a Promise and I need to await it first
export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {

    const resolvedParams = await params;
    const profile = await getProfile(resolvedParams.username);
    const accentColor = profile.accentColor || '#333333';

    const defaultAvatar = 'https://zszww9q15dfion7m.public.blob.vercel-storage.com/avatars/default-avatar.png';
    const finalAvatarUrl = profile.avatarUrl || defaultAvatar;

    return (


        <main style={{
            background: `radial-gradient(ellipse 120% 70% at 50% 0%, ${accentColor + "60"}, transparent 60%), #000000`,
        }}>
            <div className="flex flex-col items-center min-h-screen p-4 md:p-8">

                <div className="w-full max-w-[700px] pt-6">
                    <div className="flex flex-col items-center gap-4">
                            <Image src={finalAvatarUrl} alt="Profile Picture" width={120} height={120}
                            className="rounded-full shadow-2xl" />

                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold">{profile.displayName}</h1>
                                <p className="text-lg text-neutral-400 font-light mt-2">@{profile.username}</p>
                            </div>
                        </div>
                    <div className="flex flex-col gap-4">
                        {profile.links.map((link) => (
                            <TrackedLinkButton
                                key={link.id}
                                link={link}
                                accentColor={accentColor}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </main>
    );
}