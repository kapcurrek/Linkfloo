"use client"

import { useState } from "react";
import { updateAccentColor } from "@/lib/personalization";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HexColorPicker } from "react-colorful";


export function EditAccentColorModal({ currentAccentColor }: { currentAccentColor: string }) {

    // this controls if the modal is open or not
    const [isOpen, setIsOpen] = useState(false);
    const [pickedColor, setPickedColor] = useState(currentAccentColor || "");

    async function actionWrapper(formData: FormData) {
        const newFormData = new FormData();
        newFormData.append("accentColor", pickedColor);

        const result = await updateAccentColor(newFormData);


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

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Zmień kolor akcentu</DialogTitle>
                    <DialogDescription>
                        Wybierz kolor. Zostaw puste (kliknij "Wyczyść"), by użyć domyślnego.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    actionWrapper(new FormData());
                }}>

                    <div className="flex justify-center my-4">
                        <HexColorPicker color={pickedColor} onChange={setPickedColor} />
                    </div>

                    <div className="text-center font-mono p-2 border rounded-md">
                        {pickedColor || "Domyślny (brak)"}
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setPickedColor(currentAccentColor || "")}
                        >
                            Resetuj
                        </Button>
                        <Button type="submit">Zapisz</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}