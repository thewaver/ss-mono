import { describe, expect, it } from "vitest";

import { IOUtils } from "../../src/Web/io.js";

const file = (name: string, type: string) => ({ name, type });

describe("IOUtils.matchesAccept", () => {
    it("takes every file when there is no list", () => {
        expect(IOUtils.matchesAccept(file("a.bin", ""), undefined)).toBe(true);
        expect(IOUtils.matchesAccept(file("a.bin", ""), "")).toBe(true);
    });

    it("matches an exact MIME type, ignoring case and parameters", () => {
        expect(IOUtils.matchesAccept(file("a.txt", "text/plain"), "TEXT/Plain")).toBe(true);
        expect(IOUtils.matchesAccept(file("a.txt", "text/plain"), "text/plain; charset=utf-8")).toBe(true);
        expect(IOUtils.matchesAccept(file("a.csv", "text/csv"), "text/plain")).toBe(false);
    });

    it("matches a wildcard subtype against the main type only", () => {
        expect(IOUtils.matchesAccept(file("a.png", "image/png"), "image/*")).toBe(true);
        expect(IOUtils.matchesAccept(file("a.mp4", "video/mp4"), "image/*")).toBe(false);
    });

    it("matches an extension against the end of the name, ignoring case", () => {
        expect(IOUtils.matchesAccept(file("Photo.JPG", "image/jpeg"), ".jpg")).toBe(true);
        expect(IOUtils.matchesAccept(file("photo.jpg.txt", "text/plain"), ".jpg")).toBe(false);
    });

    it("lets a file with no type match only by extension", () => {
        expect(IOUtils.matchesAccept(file("data.heic", ""), "image/*")).toBe(false);
        expect(IOUtils.matchesAccept(file("data.heic", ""), "image/*, .heic")).toBe(true);
    });

    it("takes a file that matches any one token of the list", () => {
        expect(IOUtils.matchesAccept(file("a.pdf", "application/pdf"), "image/*,application/pdf")).toBe(true);
    });

    it("ignores tokens of neither shape, and takes everything when none are left", () => {
        expect(IOUtils.matchesAccept(file("a.txt", "text/plain"), "image/*, nonsense")).toBe(false);
        expect(IOUtils.matchesAccept(file("a.txt", "text/plain"), "nonsense, .")).toBe(true);
    });
});
