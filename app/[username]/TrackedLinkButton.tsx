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
        block w-full p-4 rounded-lg text-center font-semibold

        bg-white/10
        backdrop-blur-lg
        border border-white/10

        text-white
        hover:bg-[--accent-color]
        transition-colors
        hover:cursor-pointer
      "
            style={{ '--accent-color': accentColor } as React.CSSProperties}
        >
            {link.title}
        </button>
    );

}