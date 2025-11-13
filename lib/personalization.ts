// HERE WE HANDLE PERSONALIZATION ACTIONS LIKE UPDATING DISPLAY NAME, USERNAME, AND ACCENT COLOR
"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

// NAME UPDATE ACTION
export async function updateDisplayName(formData: FormData) {
    const { userId: loggedInUserId } = await auth();
    if (!loggedInUserId) return { error: "Użytkownik niezalogowany" };

    const newDisplayName = formData.get("displayName") as string;
    const trimmedDisplayName = newDisplayName.trim();

    if (!newDisplayName) return { error: "Nazwa profilu jest wymagana." };

    if (trimmedDisplayName.length > 32) {
        return { error: "Nazwa profilu nie może przekraczać 32 znaków." };
    }

    if (trimmedDisplayName.length < 2) {
        return { error: "Nazwa profilu musi zawierać min. 2 znaki" };
    }

    try {
        await prisma.profile.update({
            where: { id: loggedInUserId },
            data: { displayName: trimmedDisplayName },
        });
        revalidatePath("/dashboard/personalizuj");
        revalidatePath("/dashboard");
        return { message: "Nazwa została zaktualizowana." };
    } catch (error) {
        return { error: "Coś poszło nie tak. Spróbuj ponownie." };
    }
}

// USERNAME UPDATE ACTION
export async function updateUsername(formData: FormData) {

    const { userId: loggedInUserId } = await auth();

    if (!loggedInUserId) return { error: "Użytkownik niezalogowany" };

    const newUsername = formData.get("username") as string;
    const trimmedUsername = newUsername.trim();
    const usernameRegex = /^[a-zA-Z0-9_-]+$/; // only letters, numbers, hyphens, underscores are allowed in usernames

    if (!newUsername) return { error: "Nazwa użytkownika jest wymagana." };

    if (trimmedUsername.length > 16) {
        return { error: "Nazwa użytkownika nie może przekraczać 16 znaków." };
    }

    if (trimmedUsername.length < 3) {
        return { error: "Nazwa użytkownika musi mieć co najmniej 3 znaki." };
    }

    // Check for invalid characters
    if (!usernameRegex.test(trimmedUsername)) {
        return { error: "Nazwa może zawierać tylko litery, cyfry, myślniki i podkreślenia." };
    }

    try {
        const existingProfile = await prisma.profile.findUnique({
            where: { username: newUsername },
        });

        if (existingProfile && existingProfile.id !== loggedInUserId) {
            return { error: "Ta nazwa użytkownika jest już zajęta." };
        }

        await prisma.profile.update({
            where: { id: loggedInUserId },
            data: { username: trimmedUsername },
        });

        revalidatePath("/dashboard/personalizuj");
        revalidatePath("/dashboard");
        revalidatePath(`/${trimmedUsername}`);

        return { message: "Nazwa użytkownika została zaktualizowana." };
    } catch (error) {
        return { error: "Ta nazwa użytkownika jest już zajęta lub wystąpił błąd." };
    }
}

// ACCENT COLOR UPDATE ACTION
export async function updateAccentColor(formData: FormData) {
    const { userId: loggedInUserId } = await auth();
    if (!loggedInUserId) return { error: "Użytkownik niezalogowany" };

    const newAccentColor = formData.get("accentColor") as string;

    try {
        await prisma.profile.update({
            where: { id: loggedInUserId },
            data: { accentColor: newAccentColor || null },
        });

        // need to get the profile to revalidate its public path to see the color change
        const profile = await prisma.profile.findUnique({ where: { id: loggedInUserId } });

        revalidatePath("/dashboard/personalizuj");
        if (profile) {
            revalidatePath(`/${profile.username}`); // revalidate public profile page after changes
        }

        return { message: "Kolor została zaktualizowany." };
    } catch (error) {
        return { error: "Coś poszło nie tak." };
    }
}