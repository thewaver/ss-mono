import type { ParentProps } from "solid-js";
import { createEffect, createSignal } from "solid-js";

import { ElementObserverSolidUtils, access } from "@thewaver/ss-components-solid";
import { NO_WIDTH } from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.css";

import { useLayerClass } from "../../../StyledComponents/Layer/Layer.context";
import type { ResizableBarProps } from "../ToolbarPageSolid.types";

export const ResizableBar = (props: ParentProps<ResizableBarProps>) => {
    const getLayerClass = useLayerClass();

    const [getRef, setRef] = createSignal<HTMLElement>();

    const getWidth = () => access(props.width);

    const getSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getRef, () => getWidth() === undefined);

    createEffect(() => {
        const ref = getRef();
        const width = getWidth();
        const measured = Math.round(getSize().width);

        if (!ref || width === undefined || measured <= NO_WIDTH) return;

        if (ref.style.width === `${width}px`) return;

        props.onResize?.(measured);
    });

    return (
        <div
            ref={setRef}
            class={getWidth() === undefined ? styles.docsResizer : styles.resizer}
            style={{ width: getWidth() === undefined ? undefined : `${getWidth()}px` }}
        >
            <div class={[styles.bar, getLayerClass()].join(" ")}>{props.children}</div>
        </div>
    );
};
