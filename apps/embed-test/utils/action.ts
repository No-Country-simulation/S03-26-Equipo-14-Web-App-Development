"use server";

const apiKey = process.env.NEXT_PUBLIC_API_KEY

export function getApikey(): string {
    return apiKey!
}