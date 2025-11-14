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
                <Button
                    variant="outline"
                    size="icon" >
                    <Pencil  />
                </Button>
            </DialogTrigger>


            <DialogContent className="sm:max-w-[500px]
             bg-black/80
             backdrop-blur-lg
             bg-gradient-to-br from-black via-black/40 via-60% to-slate-100/6
             ">

                <DialogHeader>
                    <DialogTitle>Edytuj link</DialogTitle>
                    <DialogDescription className="text-neutral-300 font-light">
                        Zmień szczegóły swojego linku. Kliknij "Zapisz", gdy skończysz.
                    </DialogDescription>
                </DialogHeader>

                <form action={actionWrapper} className="grid gap-4 py-4">

                    <input type="hidden" name="linkId" value={link.id} />

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-left">
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
                        <Button type="button" className="
                            text-natural-100
                            font-semibold
                            bg-transparent
                            hover:bg-transparent
                            hover:cursor-pointer
                            hover:scale-[1.08]
                            hover:text-orange-400
                            transition
                            duration-200
                        ">Anuluj</Button>
                      </DialogClose>

                        <Button type="submit" className="
                        text-natural-100
                        font-semibold
                        border
                        border-orange-400/40
                        bg-orange-400/50
                        hover:cursor-pointer
                        hover:bg-orange-400/80
                        hover:scale-[1.02]
                        transition
                        duration-200
                        ">Zapisz zmiany</Button>

                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}