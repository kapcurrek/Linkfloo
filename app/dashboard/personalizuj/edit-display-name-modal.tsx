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


            {/* POPUP CONTENT */}

            <DialogContent className="sm:max-w-[425px]">
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
                        <Button type="submit">Zapisz</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}