"use client"

import { useState, useRef } from "react";
import { updateAvatar, deleteAvatar } from "@/lib/personalization";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export function EditAvatarModal({ currentAvatar }: { currentAvatar: string | null }) {

    // this controls if the modal is open or not
    const [isOpen, setIsOpen] = useState(false);

    // state to hold filename of avatar file
    const [fileName, setFileName] = useState("");

    // ref to the form element
    const formRef = useRef<HTMLFormElement>(null);

    async function actionWrapper(formData: FormData) {
        const result = await updateAvatar(formData);

        if (result?.message) {
            setIsOpen(false); // Success, we close the modal
            setFileName(""); // Reset file name
        }
        if (result?.error) {
            alert(result.error); // Show error to user
        }
    }

    async function deleteActionWrapper() {
        const confirmed = confirm("Na pewno chcesz usunąć swój avatar?");
        if (!confirmed) return;

        const result = await deleteAvatar();

        if (result?.message) {
            setIsOpen(false);
            setFileName("");
            formRef.current?.reset();
        }
        if (result?.error) {
            alert(result.error);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Zmień Avatar</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]
             bg-black/80
             backdrop-blur-lg
             bg-gradient-to-br from-black via-black/40 via-60% to-slate-100/6
             ">
                <DialogHeader>
                    <DialogTitle>Zmień swój avatar</DialogTitle>
                    <DialogDescription className="text-neutral-300 font-light">
                        Wybierz plik obrazka (PNG, JPG, WEBP, AVIF, GIF - max 2MB).
                    </DialogDescription>
                </DialogHeader>


                <form
                    action={actionWrapper}
                    className="grid gap-4 py-4"
                >
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="avatar" className="text-right">Plik</Label>
                        <Input
                            id="avatar"
                            name="avatar"
                            type="file"
                            required
                            accept="image/*"
                            className="col-span-3"
                            onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                        />
                    </div>
                    {fileName && (
                        <p className="text-sm text-center text-neutral-400">Wybrano: {fileName}</p>
                    )}

                    <DialogFooter>
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
                        >Prześlij i zapisz</Button>
                    </DialogFooter>

                    <DialogFooter className="border-t pt-4 mt-2 ">
                        <Button
                            type="button"
                            disabled={!currentAvatar}
                            onClick={deleteActionWrapper}
                            className="
                            text-natural-100
                            font-semibold
                            border
                            border-red-300/40
                            bg-red-600/50
                            hover:cursor-pointer
                            hover:bg-red-600/80
                            hover:scale-[1.02]
                            transition
                            duration-200
                            w-full
                            "
                        >

                            Usuń obecny avatar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


