"use client"

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { EditLinkDialog } from "./edit-link-dialog";
import { DeleteLinkButton } from "./delete-link-button";
import { Link as LinkPrisma } from "@prisma/client";

// EXTEND Link TYPE FROM PRISMA TO INCLUDE CLICK COUNT
type Link = LinkPrisma & {_count: { clicks: number }};

// This component requires two items: link - the link data, and index - the position in the list
export function SortableLinkItem({ link, index }: { link: Link, index: number }) {

    //D&D Kit: useSortable hook to make the item draggable and sortable
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: link.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="
            p-4
            rounded-lg
            flex
            items-center
            gap-4
            border-1
            border-orange-300/20
            bg-clip-padding
            backdrop-filter
            backdrop-blur
            bg-opacity-10
            backdrop-saturate-100
            backdrop-contrast-125
            bg-gradient-to-tl from-transparent via-transparent via-40% to-orange-400/15
            ">


            <button {...attributes} {...listeners} className="p-1 cursor-grab active:cursor-grabbing">
                <GripVertical className="w-5 h-5 text-neutral-400/80" />
            </button>

            <span className=" text-neutral-100 w-4 text-right border-r-2 border-neutral-200/60 pr-7">
                {index + 1}
            </span>

            <div className="flex-grow">
                <h3 className="font-semibold">{link.title}</h3>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-400 hover:underline font-light">
                    {link.url}
                </a>
            </div>

            <div className="flex flex-col items-center px-2">
                <span className="text-lg font-bold">{link._count.clicks}</span>
                <span className="text-xs text-neutral-400">KLIKNIĘĆ</span>
            </div>

            <div className="flex items-center gap-2">
                <EditLinkDialog link={link} />
                <DeleteLinkButton linkId={link.id} />
            </div>
        </div>
    );
}