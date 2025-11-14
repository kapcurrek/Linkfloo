"use client"

import { useState } from "react";
import type { Link as LinkPrisma } from "@prisma/client";
import { updateLinkOrder } from "@/lib/actions";
import { SortableLinkItem } from "./sortable-link-item";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent, } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, } from "@dnd-kit/sortable";

// HERE WE'RE ADDING CLICK COUNT TO THE LINK TYPE FROM PRISMA
type LinkWithCount = LinkPrisma & {
    _count: { clicks: number };
}

export function LinksList({ initialLinks }: { initialLinks: LinkWithCount[] }) {

    // NEW STATE FOR LINKS ORDER. CURRENT ORDER IS COMING FROM SERVER
    const [links, setLinks] = useState(initialLinks);

    // D&D KIT SENSORS SETUP
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 12 }, // IT REQUIRES 12PX MOVE TO START DRAGGING
        })
    );

    // HERE'S WHAT HAPPENS ON DRAG END
    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        let newOrderedIds: number[] = [];

        setLinks((currentLinks) => {
            // FIND OLD AND NEW INDEX
            const oldIndex = currentLinks.findIndex((link) => link.id === active.id);
            const newIndex = currentLinks.findIndex((link) => link.id === over.id);

            // MAKE NEW ORDERED ARRAY
            const newArray = arrayMove(currentLinks, oldIndex, newIndex);

            // SAVE NEW ORDERED IDS FOR DB UPDATE
            newOrderedIds = newArray.map((l) => l.id);

            return newArray; // RETURN NEW ORDERED ARRAY
        });


        await updateLinkOrder(newOrderedIds); // UPDATE ORDER IN DB
    }


    return (

        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >

            <SortableContext
                items={links}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex flex-col gap-4">
                    {links.length === 0 ? (
                        <p className="text-neutral-500">Nie masz jeszcze żadnych linków.</p>
                    ) : (

                        links.map((link, index) => (
                            <SortableLinkItem
                                key={link.id}
                                link={link}
                                index={index}
                            />
                        ))
                    )}
                </div>
            </SortableContext>
        </DndContext>
    );
}