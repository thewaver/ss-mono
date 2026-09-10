import { createRoot, createSignal } from "solid-js";
import { describe, expect, it } from "vitest";

import type { MaskedFieldHandle } from "./MaskedField.types";
import { MaskedFieldUtils } from "./MaskedField.utils";

type Time = { hour: number; minute: number };

const DIGIT_COUNT = 4;
const SEGMENT_LENGTH = 2;
const MAX_HOUR = 23;
const MAX_MINUTE = 59;

const pad = (value: number) => String(value).padStart(SEGMENT_LENGTH, "0");

const readSegment = (digits: string, index: number) =>
    Number(digits.slice(index * SEGMENT_LENGTH, (index + 1) * SEGMENT_LENGTH));

const buildField = (initial?: Time) => {
    const value = createSignal<Time | undefined>(initial);
    const written: (Time | undefined)[] = [];

    let field!: MaskedFieldHandle<Time>;

    const dispose = createRoot((disposeRoot) => {
        field = MaskedFieldUtils.createField<Time>({
            getValue: value[0],
            setValue: (next) => {
                written.push(next);
                value[1](next);
            },
            getDigitCount: () => DIGIT_COUNT,
            toDigits: (time) => `${pad(time.hour)}${pad(time.minute)}`,
            formatDigits: (digits) =>
                digits.length <= SEGMENT_LENGTH
                    ? digits
                    : `${digits.slice(0, SEGMENT_LENGTH)}:${digits.slice(SEGMENT_LENGTH)}`,
            fromDigits: (digits) => {
                if (digits.length !== DIGIT_COUNT) return undefined;

                const hour = readSegment(digits, 0);
                const minute = readSegment(digits, 1);

                return hour > MAX_HOUR || minute > MAX_MINUTE ? undefined : { hour, minute };
            },
            getHasImpossibleDigits: (digits) =>
                (digits.length >= SEGMENT_LENGTH && readSegment(digits, 0) > MAX_HOUR) ||
                (digits.length >= DIGIT_COUNT && readSegment(digits, 1) > MAX_MINUTE),
            getIsSame: (a, b) => a?.hour === b?.hour && a?.minute === b?.minute,
        });

        return disposeRoot;
    });

    return { value, field, written, type: (text: string) => field.textSignal[1](text), dispose };
};

describe("createField", () => {
    it("opens spelled out from the value it was given", () => {
        const { field, dispose } = buildField({ hour: 9, minute: 30 });

        expect(field.textSignal[0]()).toBe("09:30");

        dispose();
    });

    it("opens empty when there is no value yet", () => {
        const { field, dispose } = buildField();

        expect(field.textSignal[0]()).toBe("");

        dispose();
    });

    it("commits once a whole time has been typed", () => {
        const { value, type, dispose } = buildField();

        type("09:30");

        expect(value[0]()).toEqual({ hour: 9, minute: 30 });

        dispose();
    });

    it("holds on to the committed value while a replacement is half typed", () => {
        const { value, type, dispose } = buildField({ hour: 9, minute: 30 });

        type("1");

        expect(value[0](), "one digit is not a time, and is not a reason to throw the old one away").toEqual({
            hour: 9,
            minute: 30,
        });

        type("17:4");

        expect(value[0]()).toEqual({ hour: 9, minute: 30 });

        type("17:45");

        expect(value[0]()).toEqual({ hour: 17, minute: 45 });

        dispose();
    });

    it("clears the value when the text is emptied, because an empty field means no time", () => {
        const { value, type, dispose } = buildField({ hour: 9, minute: 30 });

        type("");

        expect(value[0]()).toBeUndefined();

        dispose();
    });

    it("says nothing is wrong while a time is still being typed", () => {
        const { field, type, dispose } = buildField();

        expect(field.getHasIssue(), "an empty field is not a complaint").toBe(false);

        type("09:3");

        expect(field.getHasIssue()).toBe(false);

        dispose();
    });

    it("complains about a half-typed time only once the field has been left", () => {
        const { field, type, dispose } = buildField();

        type("09:3");
        field.onBlur();

        expect(field.getHasIssue()).toBe(true);

        dispose();
    });

    it("stops complaining as soon as typing resumes", () => {
        const { field, type, dispose } = buildField();

        type("09:3");
        field.onBlur();
        field.onInput();
        type("09:35");

        expect(field.getHasIssue()).toBe(false);

        dispose();
    });

    it("complains about a digit that cannot lead anywhere without waiting for the field to be left", () => {
        const { field, type, dispose } = buildField();

        type("99");

        expect(field.getHasIssue(), "no time starts with 99, so there is nothing to wait for").toBe(true);

        dispose();
    });

    it("complains about a whole entry that spells no time", () => {
        const { field, type, dispose } = buildField();

        type("09:75");

        expect(field.getHasIssue()).toBe(true);

        dispose();
    });

    it("respells the text from the value when the field is left, so a sloppy entry tidies itself", () => {
        const { field, type, dispose } = buildField({ hour: 9, minute: 30 });

        type("9:3");
        field.onBlur();

        expect(field.textSignal[0]()).toBe("09:30");

        dispose();
    });

    it("leaves a half-typed entry on screen when there is no value to respell it from", () => {
        const { field, type, dispose } = buildField();

        type("9:3");
        field.onBlur();

        expect(field.textSignal[0](), "wiping what somebody is midway through typing would lose their work").toBe(
            "9:3",
        );

        dispose();
    });

    it("respells the text when the value is changed from outside", () => {
        const { value, field, dispose } = buildField({ hour: 9, minute: 30 });

        value[1]({ hour: 17, minute: 45 });

        expect(field.textSignal[0]()).toBe("17:45");

        dispose();
    });

    it("reads digits through whatever punctuation the mask puts between them", () => {
        const { field, type, dispose } = buildField();

        type("09:30");

        expect(field.getDigits()).toBe("0930");

        dispose();
    });

    it("spells a value without going through the field, for a caller that needs the text alone", () => {
        const { field, dispose } = buildField();

        expect(field.formatValue({ hour: 7, minute: 5 })).toBe("07:05");

        dispose();
    });

    it("ignores a commit of the value already held, so an equal-but-rebuilt value is not a change", () => {
        const { field, written, dispose } = buildField({ hour: 9, minute: 30 });

        field.commit({ hour: 9, minute: 30 });

        expect(written).toEqual([]);

        field.commit({ hour: 17, minute: 45 });

        expect(written).toEqual([{ hour: 17, minute: 45 }]);

        dispose();
    });
});
