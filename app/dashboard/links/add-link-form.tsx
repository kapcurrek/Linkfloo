"use client"

import { createLink } from "@/lib/actions";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

// ADD LINK FORM COMPONENT
// Renders a popup form to add a new link to the user's profile

export function AddLinkForm() {

    const formRef = useRef<HTMLFormElement>(null);
    const [isOpen, setIsOpen] = useState(false); // State to control form visibility

    // This function is checking if the link was created successfully and resets the form or shows an alert on error
    async function actionWrapper(formData: FormData) {

        const result = await createLink(formData); // Call the createLink action and wait for the result (error or success message)
        if (result?.message) {
            formRef.current?.reset();
        }
        if (result?.error) {
            alert(result.error);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>

            <DialogTrigger asChild>
                <Button className="
                    text-natural-100
                    font-semibold
                    border
                    border-orange-600/30
                    bg-orange-400/50
                    hover:cursor-pointer
                    hover:bg-orange-400/80
                    hover:scale-[1.02]
                    transition
                    duration-200
                    ">
                    <Plus className="w-4 h-4" />
                    Dodaj link
                </Button>
            </DialogTrigger>


            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Dodaj nowy link</DialogTitle>
                    <DialogDescription>
                        Wklej tytuł i URL. Możesz zmienić kolejność później.
                    </DialogDescription>
                </DialogHeader>

                <form
                    ref={formRef}
                    action={actionWrapper}
                    className="flex flex-col gap-4 py-4"
                >
                    <div>
                        <Label htmlFor="title" className="block text-sm font-medium mb-1">
                            Tytuł
                        </Label>
                        <Input
                            type="text"
                            id="title"
                            name="title"
                            required
                            className="w-full p-2 border rounded-md bg-transparent"
                        />
                    </div>

                    <div>
                        <Label htmlFor="url" className="block text-sm font-medium mb-1">
                            URL
                        </Label>
                        <Input
                            type="url"
                            id="url"
                            name="url"
                            required
                            className="w-full p-2 border rounded-md bg-transparent"
                        />
                    </div>

                    <DialogFooter className="mt-4">
                        <Button type="submit">Dodaj</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
