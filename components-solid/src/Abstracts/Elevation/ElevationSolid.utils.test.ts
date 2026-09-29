import { createRoot, createSignal } from "solid-js";
import { describe, expect, it } from "vitest";

import { ElevationUtils } from "@thewaver/ss-components";

import { ElevationSolidUtils } from "./ElevationSolid.utils";

type FakeElement = { parent?: FakeElement; contains: (other: FakeElement | null) => boolean };

const box = (parent?: FakeElement): FakeElement => {
    const node: FakeElement = {
        parent,
        contains: (other) => {
            for (let current = other; current; current = current.parent ?? null) {
                if (current === node) return true;
            }

            return false;
        },
    };

    return node;
};

const asElement = (element: FakeElement) => element as unknown as HTMLElement;

describe("createElevation", () => {
    it("registers nothing while the layer is not active", () => {
        const modal = box();

        const dispose = createRoot((disposeRoot) => {
            ElevationSolidUtils.createElevation(
                () => asElement(modal),
                () => false,
                () => 100,
            );

            return disposeRoot;
        });

        expect(ElevationUtils.getBase(asElement(box(modal)))).toBe(0);

        dispose();
    });

    it("follows a layer whose depth is changed after it opened", () => {
        const modal = box();
        const button = asElement(box(modal));

        const [getZIndex, setZIndex] = createSignal(100);

        const dispose = createRoot((disposeRoot) => {
            ElevationSolidUtils.createElevation(
                () => asElement(modal),
                () => true,
                getZIndex,
            );

            return disposeRoot;
        });

        expect(ElevationUtils.getBase(button)).toBe(100);

        setZIndex(500);

        expect(
            ElevationUtils.getBase(button),
            "the layer kept its place in the stack and took the new depth with it",
        ).toBe(500);

        dispose();

        expect(ElevationUtils.getBase(button), "and disposing the owner takes it away").toBe(0);
    });
});
