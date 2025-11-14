import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function DashboardButtonItem(buttonProps) {
    const { name, addr } = buttonProps; // Destructuring props: 'name' - is label for button, 'addr' - is link address
    return(
        <Button asChild className="
        h-[80px]
        text-xl
        font-medium
        bg-white/10
        py-2
        px-4
        border
        border-white/20
        shadow-lg
        backdrop-blur-lg
        text-neutral-100
        hover:bg-orange-400/20
        hover:scale-[1.02]
        transition
        duration-200
        w-full
        ">
            <Link href={addr}>{name}</Link>
        </Button>
    )
}