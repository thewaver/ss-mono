import { type Accessor, createEffect, onCleanup } from "solid-js";

import { DismisserUtils } from "./Dismisser.utils";
import type { DismisserLayerDefs } from "./DismisserStack.types";

const layers: DismisserLayerDefs[] = [];

const getIsOutside = (layer: DismisserLayerDefs, target: Node | null) =>
    !DismisserUtils.getIsWithinOwnedLayer(target, layer.getRoots());

const dismissOutside = (target: Node | null, reason: "press" | "focus") => {
    if (!target) return;

    for (const layer of [...layers].reverse()) {
        if (getIsOutside(layer, target)) layer.onDismiss(reason);
    }
};

const handlePointerDown = (e: PointerEvent) => {
    dismissOutside(e.target as Node | null, "press");
};

const handleFocusOut = (e: FocusEvent) => {
    dismissOutside(e.relatedTarget as Node | null, "focus");
};

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;

    const top = layers[layers.length - 1];

    if (!top) return;

    e.preventDefault();
    top.onDismiss("escape");
};

const attach = () => {
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("focusout", handleFocusOut);
    document.addEventListener("keydown", handleKeyDown);
};

const detach = () => {
    document.removeEventListener("pointerdown", handlePointerDown);
    document.removeEventListener("focusout", handleFocusOut);
    document.removeEventListener("keydown", handleKeyDown);
};

export namespace DismisserStack {
    export const createLayer = (getIsOpen: Accessor<boolean>, defs: DismisserLayerDefs) => {
        createEffect(() => {
            if (!getIsOpen()) return;

            layers.push(defs);

            if (layers.length === 1) attach();

            onCleanup(() => {
                const index = layers.indexOf(defs);

                if (index >= 0) layers.splice(index, 1);
                if (layers.length === 0) detach();
            });
        });
    };
}
