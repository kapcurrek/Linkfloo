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
                    createdAt: 'desc',
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

    return (


        <main style={{ '--accent-color': accentColor } as React.CSSProperties}>
            <div className="flex flex-col items-center min-h-screen p-4 md:p-8">

                <div className="w-full max-w-md mx-auto">

                    {/* Avatar (na razie prosty placeholder) */}
                    <div className="w-24 h-24 rounded-full bg-neutral-700 mx-auto mb-4 overflow-hidden">
                        {/* W przyszłości: <Image src={profile.avatarUrl} ... /> */}

                    </div>

                    {/* Info o userze */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold">{profile.displayName}</h1>
                        <p className="text-lg text-neutral-400">@{profile.username}</p>
                    </div>

                    {/* Lista linków */}
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