import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try{
        const body = await request.json();
        const { linkId } = body;

        if (!linkId) {
            return NextResponse.json({ error: "ID linku jest wymagane." }, { status: 400 });
        }

        await prisma.click.create(
            {
                data: {
                    linkId: parseInt(linkId)
                },
            }
        )

        return NextResponse.json(
            { message: "Kliknięcie zostało zarejestrowane." },
            { status: 200, headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                },
            }
        )
    } catch (error) {
        console.error("Błąd API /api/click: ", error);
        return NextResponse.json(
            { error: "Wystąpił błąd podczas rejestrowania kliknięcia." },
            { status: 500 }
        );
    }

}

export async function OPTIONS() {
    return NextResponse.json({}, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}