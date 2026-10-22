import { untrack } from "svelte";

import type { InteractionSizing, PaginatorControlEntry, PlacementRect } from "@thewaver/ss-components";
import { PlacementConst } from "@thewaver/ss-components/internal";

import type { PaginatorSvelteContextType } from "./Paginator.context.types.js";

/** The Svelte side of `PaginatorUtils`: one step, page or gap registered with its root and placed by its layout. */
export namespace PaginatorSvelteUtils {
    /**
     * Registers one control with its `PaginatorRoot` and answers where the root's layout put it.
     *
     * The control registers at once, so its place is known before it is first drawn, and asks the root to sort again
     * once it is in the document, since a detached element has no position to sort by. The root drops it when the
     * calling component is destroyed.
     *
     * Must run while a component is being set up.
     *
     * @param context The root's context, from `getPaginatorContext`.
     * @param getElement The control's element, once it exists. Read reactively.
     * @returns `getPlacement`, the control's place under a layout or `undefined` in a plain row; `getSizing`, how its
     * wrapper sizes itself to match; and `getStackAt`, where it stacks among the placed controls. All three are
     * reactive.
     */
    export const createPlacedControl = (
        context: PaginatorSvelteContextType,
        getElement: () => HTMLElement | null | undefined,
    ) => {
        const entry: PaginatorControlEntry = { getElementRef: () => getElement() ?? undefined };

        context.register(entry);

        $effect(() => untrack(() => context.reorder()));

        const placement = $derived(context.computePlacement(entry));

        return {
            getPlacement: (): PlacementRect | undefined => placement,
            getSizing: (): InteractionSizing =>
                placement === undefined ? PlacementConst.ROW_SIZING : PlacementConst.PLACED_SIZING,
            getStackAt: () => context.computeStackAt(entry),
        };
    };
}
