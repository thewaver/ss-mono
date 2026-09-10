import { createRoot, createSignal } from "solid-js";
import { describe, expect, it } from "vitest";

import { ElevationUtils } from "./Elevation.utils";

type FakeElement = { name: string; parent?: FakeElement; contains: (other: FakeElement | null) => boolean };

const box = (name: string, parent?: FakeElement): FakeElement => {
    const node: FakeElement = {
        name,
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

const elevate = (element: FakeElement, zIndex: number, isActive = true) => {
    let dispose!: () => void;

    createRoot((disposeRoot) => {
        ElevationUtils.createElevation(
            () => asElement(element),
            () => isActive,
            () => zIndex,
        );

        dispose = disposeRoot;
    });

    return dispose;
};

describe("getBase", () => {
    it("reports no elevation for an element that sits under nothing", () => {
        expect(ElevationUtils.getBase(asElement(box("loose")))).toBe(0);
    });

    it("reports no elevation when there is no element to ask about", () => {
        expect(ElevationUtils.getBase(undefined)).toBe(0);
    });

    it("reports the layer an element sits inside", () => {
        const modal = box("modal");
        const dispose = elevate(modal, 100);

        expect(ElevationUtils.getBase(asElement(box("button", modal)))).toBe(100);

        dispose();
    });

    it("counts a layer as containing itself, so the layer's own chrome rides with it", () => {
        const modal = box("modal");
        const dispose = elevate(modal, 100);

        expect(ElevationUtils.getBase(asElement(modal))).toBe(100);

        dispose();
    });

    it("takes the highest of the layers an element is inside, so a popover in a modal clears the modal", () => {
        const modal = box("modal");
        const drawer = box("drawer", modal);
        const disposeModal = elevate(modal, 100);
        const disposeDrawer = elevate(drawer, 300);

        expect(ElevationUtils.getBase(asElement(box("button", drawer)))).toBe(300);

        disposeDrawer();
        disposeModal();
    });

    it("ignores a layer the element is not inside, however high that layer sits", () => {
        const modal = box("modal");
        const elsewhere = box("elsewhere");
        const dispose = elevate(elsewhere, 900);

        expect(ElevationUtils.getBase(asElement(box("button", modal)))).toBe(0);

        dispose();
    });

    it("ignores a layer that is not active", () => {
        const modal = box("modal");
        const dispose = elevate(modal, 100, false);

        expect(ElevationUtils.getBase(asElement(box("button", modal)))).toBe(0);

        dispose();
    });

    it("drops back once a layer is torn down, rather than leaving its number behind", () => {
        const modal = box("modal");
        const button = asElement(box("button", modal));
        const dispose = elevate(modal, 100);

        expect(ElevationUtils.getBase(button)).toBe(100);

        dispose();

        expect(ElevationUtils.getBase(button)).toBe(0);
    });

    it("falls back to the outer layer when the inner one closes", () => {
        const modal = box("modal");
        const drawer = box("drawer", modal);
        const button = asElement(box("button", drawer));
        const disposeModal = elevate(modal, 100);
        const disposeDrawer = elevate(drawer, 300);

        expect(ElevationUtils.getBase(button)).toBe(300);

        disposeDrawer();

        expect(ElevationUtils.getBase(button)).toBe(100);

        disposeModal();
    });

    it("follows a layer whose depth is changed after it opened", () => {
        const modal = box("modal");
        const button = asElement(box("button", modal));

        const [getZIndex, setZIndex] = createSignal(100);

        const dispose = createRoot((disposeRoot) => {
            ElevationUtils.createElevation(
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
    });
});
