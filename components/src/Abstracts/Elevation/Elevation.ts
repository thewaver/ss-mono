import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

type ElevationEntry = {
    element: HTMLElement;
    zIndex: number;
};

const NO_ELEVATION = 0;

const entries: ElevationEntry[] = [];

const [getRevision, setRevision] = createSignal(0);

const bumpRevision = () => {
    setRevision((previous) => previous + 1);
};

export namespace Elevation {
    export const createElevation = (
        getElement: Accessor<HTMLElement | undefined>,
        getIsActive: Accessor<boolean>,
        getZIndex: Accessor<number>,
    ) => {
        createEffect(() => {
            const element = getElement();
            const zIndex = getZIndex();

            if (!getIsActive() || !element) return;

            const entry: ElevationEntry = { element, zIndex };

            entries.push(entry);
            bumpRevision();

            onCleanup(() => {
                const index = entries.indexOf(entry);

                if (index >= 0) entries.splice(index, 1);

                bumpRevision();
            });
        });
    };

    export const getBase = (element: HTMLElement | undefined) => {
        getRevision();

        if (!element) return NO_ELEVATION;

        let base = NO_ELEVATION;

        for (const entry of entries) {
            if (entry.element.contains(element)) base = Math.max(base, entry.zIndex);
        }

        return base;
    };
}
