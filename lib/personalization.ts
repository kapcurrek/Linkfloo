// HERE WE HANDLE PERSONALIZATION ACTIONS LIKE UPDATING DISPLAY NAME, USERNAME, AND ACCENT COLOR
"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { put, del } from "@vercel/blob";
import sharp from "sharp";
import { Buffer } from "buffer";

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


// AVATAR UPDATE ACTION

export async function updateAvatar(formData: FormData) {

    const { userId: loggedInUserId } = await auth();
    if (!loggedInUserId) return { error: "Użytkownik niezalogowany" };

    const file = formData.get("avatar") as File; // get the uploaded file from the formdata

    // FILE VALIDATIONS
    if (!file) return { error: "Nie wybrano pliku." };
    if (file.size > 10 * 1024 * 1024) { // 2MB limit
        return { error: "Plik jest za duży (max 2MB)." };
    }
    if (!file.type.startsWith("image/")) {
        return { error: "Niepoprawny typ pliku (dozwolone tylko obrazki)." };
    }

    try {

        // Get current profile to delete old avatar if exists
        const profile = await prisma.profile.findUnique({
            where: { id: loggedInUserId },
            select: { avatarUrl: true, username: true }
        });

        if (!profile) return { error: "Nie znaleziono profilu." };

        // Process the image using sharp to convert it to webp format and compress to save space
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const processedBuffer = await sharp(fileBuffer)
            .resize({ width: 800 })
            .webp({ quality: 80 })
            .toBuffer();

        const fileName = "avatar.webp";
        const filePath = `avatars/${loggedInUserId}/${fileName}`;

        const blob = await put(
            filePath,
            processedBuffer, // here we use the processed webp buffer file
            {
                access: 'public',
                contentType: 'image/webp',
                allowOverwrite: true,
                addRandomSuffix: true
            }
        );

        await prisma.profile.update({
            where: { id: loggedInUserId },
            data: {
                avatarUrl: blob.url,
            },
        });

        if (profile.avatarUrl) {
            await del(profile.avatarUrl);  // delete old avatar from storage by downloaded before updating old URL
        }

        revalidatePath("/dashboard/personalizuj");
        revalidatePath("/dashboard");

        if (profile) revalidatePath(`/${profile.username}`);

        return { message: "Avatar zaktualizowany.", newAvatarUrl: blob.url };

    } catch (error) {
        console.error("Błąd przy uploadzie avatara:", error);
        return { error: `Coś poszło nie tak podczas wysyłania pliku: ${error}` };
    }
}

// AVATAR DELETE ACTION

export async function deleteAvatar() {

    const { userId: loggedInUserId } = await auth();
    if (!loggedInUserId) return { error: "Użytkownik niezalogowany" };

    try {

        const profile = await prisma.profile.findUnique({
            where: { id: loggedInUserId },
            select: { avatarUrl: true, username: true }
        });

        if (!profile) return { error: "Nie znaleziono profilu." };


        if (profile.avatarUrl) {
            await del(profile.avatarUrl);
        }


        await prisma.profile.update({
            where: { id: loggedInUserId },
            data: {
                avatarUrl: null,
            },
        });


        revalidatePath("/dashboard/personalizuj");
        revalidatePath("/dashboard");
        if (profile) revalidatePath(`/${profile.username}`);

        return { message: "Avatar usunięty." };

    } catch (error) {
        console.error("Błąd przy usuwaniu avatara:", error);
        return { error: "Coś poszło nie tak." };
    }
}