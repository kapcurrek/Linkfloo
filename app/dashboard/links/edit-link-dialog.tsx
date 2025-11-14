"use client"

import { updateLink } from "@/lib/actions";
import { Link } from "@prisma/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose,} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";


// EDIT LINK DIALOG COMPONENT
// Renders a dialog to edit an existing link

export function EditLinkDialog({ link }: { link: Link }) {

    // State to control the visibility of the dialog and setting it to closed by default
    const [isOpen, setIsOpen] = useState(false);

    // This function wraps the updateLink action to check for success or error messages
    async function actionWrapper(formData: FormData) {

        const result = await updateLink(formData); // We await the result of the updateLink action (error or success message)

        if (result?.message) {
            setIsOpen(false); // This will close the modal on success
        }
        if (result?.error) {
            alert(result.error);
        }

    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>

            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Pencil className="w-4 h-4" />
                </Button>
            </DialogTrigger>


            <DialogContent className="sm:max-w-[425px]">

                <DialogHeader>
                    <DialogTitle>Edytuj link</DialogTitle>
                    <DialogDescription>
                        Zmień szczegóły swojego linku. Kliknij "Zapisz", gdy skończysz.
                    </DialogDescription>
                </DialogHeader>

                <form action={actionWrapper} className="grid gap-4 py-4">

                    <input type="hidden" name="linkId" value={link.id} />

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Tytuł
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            defaultValue={link.title}
                            className="col-span-3"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="url" className="text-right">
                            URL
                        </Label>
                        <Input
                            id="url"
                            name="url"
                            defaultValue={link.url}
                            className="col-span-3"
                            required
                        />
                    </div>

                    <DialogFooter>

                      <DialogClose asChild>
                        <Button type="button" variant="ghost">Anuluj</Button>
                      </DialogClose>

                        <Button type="submit">Zapisz zmiany</Button>

                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}