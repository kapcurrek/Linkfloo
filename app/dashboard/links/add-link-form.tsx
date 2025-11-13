"use client"

import { createLink } from "@/lib/actions";
import { useRef } from "react";

// ADD LINK FORM COMPONENT
// Renders a form to add a new link to the user's profile

export function AddLinkForm( { profileId }: { profileId: string } ) {

    const formRef = useRef<HTMLFormElement>(null);

    // This function is checking if the link was created successfully and resets the form or shows an alert on error
    async function actionWrapper(formData: FormData) {

        const result = await createLink(formData);

        if (result?.message) {
            formRef.current?.reset();
        }

        if (result?.error) {
            alert(result.error);
        }
    }

    return (

        // Form to add a new link

        <form
            ref={formRef}
            action={actionWrapper}
            className="flex flex-col gap-4 p-4 border rounded-lg max-w-sm"
        >
            <h2 className="text-xl font-semibold">Dodaj nowy link</h2>


            {/* Title input field */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Tytuł linku:
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    className="w-full p-2 border rounded-md bg-transparent"
                />
            </div>


            {/* URL input field */}
            <div>
                <label htmlFor="url" className="block text-sm font-medium mb-1">
                    URL:
                </label>
                <input
                    type="url"
                    id="url"
                    name="url"
                    required
                    className="w-full p-2 border rounded-md bg-transparent"
                />
            </div>

            {/* Submit button */}
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:cursor-pointer"> Dodaj </button>
        </form>
    );
}
