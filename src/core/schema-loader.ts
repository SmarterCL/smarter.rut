import { z } from "zod";

export const ToolDefinitionSchema = z.object({
    name: z.string(),
    description: z.string(),
    handler: z.string().optional(),
    parameters: z.any()
});

export const RoleDefinitionSchema = z.object({
    description: z.string(),
    system_prompt: z.string(),
    allowed_tools: z.array(z.string()),
    restricted_resources: z.array(z.string()),
    rate_limit: z.object({
        requests_per_minute: z.number()
    })
});

export class SmarterSpecLoader {
    // Using local path for now since we are in the dev environment.
    // In production, this might point to a raw github url or relative path.
    // Assuming the specs are in the root directory 'smarteros-specs' relative to where this runs
    // Note: For client-side fetch, this needs to be an API endpoint or accessible URL.
    // IF running on server-side (Node), we should use 'fs'.
    // Given the context of "Node 22", I'll use fs for local loading to be robust, 
    // or a placeholder URL if intended for web fetching. 
    // user mentioned: private baseUrl = "https://raw.githubusercontent.com/SmarterCL/smarteros-specs/main/core";
    // I will use the local file system for reliability in this specific dev environment context,
    // but keep the structure similar to the request. However, since the user explicitly provided code with fetch
    // and a github URL, I will implement it as requested but allow for local testing adjustment if needed.

    // Actually, to make it work immediately in this local env without pushing to GitHub yet:
    // I will use a local file reading approach if possible or assume the user will push.
    // The user said: "Sube esos JSONs a tu repo... Dime cuando esté arriba".
    // Since I am an AI, I cannot push to their remote repo directly without credentials.
    // I will faithfully implement the loader as requested, assuming the user deals with the remote,
    // OR I can adapt it to read local files for 'dev' mode. 

    // Let's stick to the user's requested implementation:
    private baseUrl = "https://raw.githubusercontent.com/SmarterCL/smarteros-specs/main/core";

    async loadTools() {
        try {
            const res = await fetch(`${this.baseUrl}/tools.json`);
            if (!res.ok) throw new Error(`Failed to load tools: ${res.statusText}`);
            const json = await res.json();

            return Object.entries(json).map(([key, val]: [string, any]) => ({
                name: key,
                ...val
            }));
        } catch (error) {
            console.error("Error loading tools:", error);
            throw error;
        }
    }

    async loadRole(roleName: string) {
        try {
            const res = await fetch(`${this.baseUrl}/prompts.json`);
            if (!res.ok) throw new Error(`Failed to load prompts: ${res.statusText}`);
            const roles = await res.json();
            const role = roles[roleName];

            if (!role) throw new Error(`Rol ${roleName} no definido en Specs`);
            return RoleDefinitionSchema.parse(role);
        } catch (error) {
            console.error(`Error loading role ${roleName}:`, error);
            throw error;
        }
    }
}
