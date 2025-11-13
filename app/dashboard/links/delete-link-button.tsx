"use client"

import { deleteLink } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export function DeleteLinkButton({ linkId }: { linkId: number }) {

    const actionWrapper = async (formData: FormData) => {

        // LINK DELETE CONFIRMATION DIALOG
        const confirmed = confirm("Na pewno chcesz usunąć ten link? Tej akcji nie można cofnąć.");

        if (!confirmed) {
            return; // user changed their mind and cancelled the deletion
        }

        const result = await deleteLink(formData);

        if (result?.error) {
            alert(result.error); // if error occurred, show alert
        }

    }

    return(
        <form action={actionWrapper}>
            <input type="hidden" name="linkId" value={linkId} />
            <Button
                type="submit"
                variant="destructive"
                size="sm"
            >
                Usuń
            </Button>
        </form>
    )
}