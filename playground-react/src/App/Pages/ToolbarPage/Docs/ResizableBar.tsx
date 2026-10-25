import { type PropsWithChildren, useEffect, useRef } from "react";

import { ElementObserverReactUtils } from "@thewaver/ss-components-react";
import { NO_WIDTH } from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.css";

import { useLayerClass } from "../../../StyledComponents/Layer/Layer.context";
import type { ResizableBarProps } from "../ToolbarPageReact.types";

export const ResizableBar = (props: PropsWithChildren<ResizableBarProps>) => {
    const layerClass = useLayerClass();

    const ref = useRef<HTMLDivElement | null>(null);

    const width = props.width;

    const size = ElementObserverReactUtils.useBorderBoxSize(ref, width === undefined);

    const measured = Math.round(size.width);

    useEffect(() => {
        const element = ref.current;

        if (!element || width === undefined || measured <= NO_WIDTH) return;

        if (element.style.width === `${width}px`) return;

        props.onResize?.(measured);
    }, [measured, width]);

    return (
        <div
            ref={ref}
            className={width === undefined ? styles.docsResizer : styles.resizer}
            style={{ width: width === undefined ? undefined : `${width}px` }}
        >
            <div className={[styles.bar, layerClass].join(" ")}>{props.children}</div>
        </div>
    );
};
