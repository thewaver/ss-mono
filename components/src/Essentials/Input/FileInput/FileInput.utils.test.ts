import { describe, expect, it } from "vitest";

import type { FileInputAdmission } from "./FileInput.types";
import { FileInputUtils } from "./FileInput.utils";

const makeFile = (name: string, type: string, size = 1) => new File(["x".repeat(size)], name, { type });

const spell = (admission: FileInputAdmission) => ({
    accepted: admission.accepted.map((file) => file.name),
    rejections: admission.rejections.map((rejection) => `${rejection.file.name}: ${rejection.reason}`),
});

describe("admitFiles", () => {
    it("takes one file on a control that is not multiple, whatever maxFiles says", () => {
        const files = [makeFile("a.txt", "text/plain"), makeFile("b.txt", "text/plain")];

        expect(spell(FileInputUtils.admitFiles(files, { maxFiles: 5 }))).toEqual({
            accepted: ["a.txt"],
            rejections: ["b.txt: count"],
        });
    });

    it("takes every file on a multiple control with no limits", () => {
        const files = [makeFile("a.txt", "text/plain"), makeFile("b.txt", "text/plain")];

        expect(spell(FileInputUtils.admitFiles(files, { isMultiple: true }))).toEqual({
            accepted: ["a.txt", "b.txt"],
            rejections: [],
        });
    });

    it("refuses the files that arrive after the control is full, keeping the earliest", () => {
        const files = ["a", "b", "c", "d"].map((name) => makeFile(`${name}.txt`, "text/plain"));

        expect(spell(FileInputUtils.admitFiles(files, { isMultiple: true, maxFiles: 2 }))).toEqual({
            accepted: ["a.txt", "b.txt"],
            rejections: ["c.txt: count", "d.txt: count"],
        });
    });

    it("refuses a file larger than the limit and keeps one exactly at it", () => {
        const files = [makeFile("big.txt", "text/plain", 11), makeFile("edge.txt", "text/plain", 10)];

        expect(spell(FileInputUtils.admitFiles(files, { isMultiple: true, maxSizeBytes: 10 }))).toEqual({
            accepted: ["edge.txt"],
            rejections: ["big.txt: size"],
        });
    });

    it("checks type before size, and size before count", () => {
        const files = [makeFile("huge.txt", "text/plain", 50)];

        expect(spell(FileInputUtils.admitFiles(files, { accept: "image/*", maxSizeBytes: 10 }))).toEqual({
            accepted: [],
            rejections: ["huge.txt: type"],
        });

        const full = [makeFile("a.png", "image/png"), makeFile("huge.png", "image/png", 50)];

        expect(spell(FileInputUtils.admitFiles(full, { maxSizeBytes: 10 }))).toEqual({
            accepted: ["a.png"],
            rejections: ["huge.png: size"],
        });
    });

    it("counts only the files that passed type and size towards the limit", () => {
        const files = [
            makeFile("notes.txt", "text/plain"),
            makeFile("huge.png", "image/png", 50),
            makeFile("a.png", "image/png"),
            makeFile("b.png", "image/png"),
            makeFile("c.png", "image/png"),
        ];

        expect(
            spell(
                FileInputUtils.admitFiles(files, {
                    accept: "image/*",
                    isMultiple: true,
                    maxFiles: 2,
                    maxSizeBytes: 10,
                }),
            ),
        ).toEqual({
            accepted: ["a.png", "b.png"],
            rejections: ["notes.txt: type", "huge.png: size", "c.png: count"],
        });
    });

    it("hands back the very files it was given", () => {
        const file = makeFile("a.txt", "text/plain");
        const { accepted } = FileInputUtils.admitFiles([file], {});

        expect(accepted[0]).toBe(file);
    });
});
