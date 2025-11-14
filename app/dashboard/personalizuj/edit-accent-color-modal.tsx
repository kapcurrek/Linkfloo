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

            <DialogContent className="sm:max-w-[500px]
             bg-black/80
             backdrop-blur-lg
             bg-gradient-to-br from-black via-black/40 via-60% to-slate-100/6
             ">
                <DialogHeader>
                    <DialogTitle>Zmień kolor akcentu</DialogTitle>
                    <DialogDescription className="text-neutral-300 font-light">
                        Wybierz kolor, który będzie używany jako akcent na Twoim publicznym profilu. Kliknij "Zapisz", gdy skończysz. "Resetuj" przywróci obecny kolor.
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
                            onClick={() => setPickedColor(currentAccentColor || "")}
                            className="
                            text-natural-100
                            font-semibold
                            bg-transparent
                            hover:bg-transparent
                            hover:cursor-pointer
                            hover:scale-[1.08]
                            hover:text-orange-400
                            transition
                            duration-200
                        "
                        >
                            Resetuj
                        </Button>
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
                        "
                        >Zapisz</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}