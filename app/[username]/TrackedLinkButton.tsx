"use client"

import { Link } from "@prisma/client";

export function TrackedLinkButton({ link, accentColor }: { link: Link, accentColor: string }) {

    const handleTrackedClick = async () => {
        try {
            fetch('/api/click', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ linkId: link.id }),
                keepalive: true,
            });
        } catch (error) {
            console.error("Błąd przy śledzeniu kliknięcia:", error);
        }

        setTimeout(() => {
            window.location.href = link.url;
        }, 100);
    };

    return (
        <button
            onClick={handleTrackedClick}
            className="
            p-4
            rounded-lg
            flex
            items-center
            justify-center
            gap-4
            border-1
            border-white/20
            backdrop-filter
            backdrop-blur
            bg-gradient-to-tl from-transparent via-transparent via-50% to-neutral-200/12
            hover:bg-gradient-to-tl hover:from-transparent hover:via-transparent hover:via-0% hover:to-neutral-200/30
            cursor-pointer
            hover:scale-[1.09]
            transform
            transition
            duration-200
            text-lg
            font-semibold
            "
        >
            {link.title}
        </button>
    );

}