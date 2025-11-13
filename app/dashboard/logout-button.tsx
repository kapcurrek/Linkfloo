"use client"

import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
    return (
        <SignOutButton redirectUrl="/">
            <Button variant="destructive" className="w-full hover:cursor-pointer">
                Wyloguj się
            </Button>
        </SignOutButton>
    );
}