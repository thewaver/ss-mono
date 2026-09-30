export type AboutCodeLanguage = "shell" | "tsx" | "vue" | "svelte";

export type AboutLink = { text: string; href: string };

export type AboutInline = string | AboutLink;

export type AboutBlock =
    | { kind: "paragraph"; text: AboutInline[] }
    | { kind: "list"; items: AboutInline[][] }
    | { kind: "code"; language: AboutCodeLanguage; source: string };

export type AboutSection = {
    heading: string;
    blocks: AboutBlock[];
};
