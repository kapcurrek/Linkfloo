"use client"

import { deleteLink } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

// TRASH BUTTON FOR DELETING A LINK
export function DeleteLinkButton({ linkId }: { linkId: number }) {

    const actionWrapper = async (formData: FormData) => {
        const confirmed = confirm("Na pewno chcesz usunąć ten link?"); // Confirm deletion
        if (!confirmed) return;

        const result = await deleteLink(formData); // Call the deleteLink action and wait for the result message or error
        if (result?.error) alert(result.error);
    };

    return (
        <form action={actionWrapper}>
            <input type="hidden" name="linkId" value={linkId} />
            <Button
                type="submit"
                variant="outline"
                size="icon"
                className="text-red-500 hover:text-red-400"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </form>
    );
}