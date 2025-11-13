"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";


// NEW LINK CREATION ACTION
export async function createLink(formData: FormData) {

    const { userId: UserId } = await auth();

    // Data from "Add new link" form
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;

    if (!UserId) {
        return { error: "Użytkownik niezalogowany" };
    }

    if (!title || !url) {
        throw new Error("Tytuł i URL są wymagane.");
    }

    // Insert new link into the database
    try {
        await prisma.link.create({
            data: {
                title: title,
                url: url,
                profileId: UserId,
            },
        });

        revalidatePath("/dashboard");
        return {message: "Link został pomyślnie utworzony."};

    } catch (error) {return {error: "Wystąpił błąd podczas tworzenia linku."};}
}



// DELETE LINK ACTION
export async function deleteLink(formData: FormData) {

    const {userId: userId} = await auth();

    // Data from "Delete link" form
    const linkId = formData.get("linkId") as string;

    if (!userId) {
        return {error: "Użytkownik niezalogowany"};
    }

    if (!linkId) {
        throw new Error("ID linku jest wymagane.");
    }

    try {
        // -- VERIFY LINK OWNERSHIP --
        // Find the link ID in the database
        const link = await prisma.link.findUnique({
            where: {
                id: parseInt(linkId),
            },
        });

        // Checking if the link exists and belongs to the user
        if (!link || link.profileId !== userId) {
            return {error: "Błąd bezpieczeństwa: Nie masz uprawnień do usunięcia tego zasobu."};
        }

        // Delete the link from the database
        await prisma.link.delete({
            where: {
                id: parseInt(linkId),
            },
        });

        revalidatePath("/dashboard");
        return {message: "Link został usunięty."};

    } catch (error) {return {error: "Coś poszło nie tak podczas usuwania."};}

}

// UPDATE LINK ACTION
export async function updateLink(formData: FormData) {

    const {userId: userId} = await auth();

    // Data from "Update link" form
    const linkId = formData.get("linkId") as string;
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;

    if (!userId) {
        return {error: "Użytkownik niezalogowany"};
    }

    if (!linkId || !title || !url) {
        return { error: "Wszystkie pola są wymagane" };
    }

    try{
        const link = await prisma.link.findUnique({
            where: {
                id: parseInt(linkId),
            },
        });

        if (!link || link.profileId !== userId) {
            return { error: "Błąd bezpieczeństwa: Nie masz uprawnień do edycji tego zasobu." };
        }

        await prisma.link.update({
            where: {
                id: parseInt(linkId),
            },
            data: {
                title: title,
                url: url,
            },
        });

        revalidatePath("/dashboard");
        return { message: "Link zaktualizowany." };

    } catch (error) {
        return { error: "Coś poszło nie tak podczas aktualizacji." };
    }
}

