"use client"

import { useState } from "react";
import { updateDisplayName } from "@/lib/personalization";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export function EditDisplayNameModal({ currentName }: { currentName: string }) {

    // this controls if the modal is open or not
    const [isOpen, setIsOpen] = useState(false);

    async function actionWrapper(formData: FormData) {
        const result = await updateDisplayName(formData);

        if (result?.message) {
            setIsOpen(false); // Success! we can now close the modal
        }
        if (result?.error) {
            alert(result.error); // if the error occurs, we just alert it
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>

            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Edytuj</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]
             bg-black/80
             backdrop-blur-lg
             bg-gradient-to-br from-black via-black/40 via-60% to-slate-100/6
             ">
                <DialogHeader>
                    <DialogTitle>Zmień nazwę</DialogTitle>
                </DialogHeader>

                <form action={actionWrapper} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="displayName" className="text-right">
                            Nazwa
                        </Label>
                        <Input
                            id="displayName"
                            name="displayName"
                            defaultValue={currentName}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit"
                                className="
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
                        "
                        >Zapisz</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}