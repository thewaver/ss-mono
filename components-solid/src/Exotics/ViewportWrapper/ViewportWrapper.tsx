import type { ParentProps } from "solid-js";
import { createMemo, createSignal, onCleanup, onMount } from "solid-js";

import { ViewportWrapperUtils, ViewportWrapperStyles as styles } from "@thewaver/ss-components";
import { Size2d } from "@thewaver/ss-utils";

import { ViewportContextProvider, useParentViewportContext } from "../../Abstracts/Viewport/Viewport.context";
import { access } from "../../Utils/propUtils";
import type { ViewportWrapperProps } from "./ViewportWrapperSolid.types";

export const ViewportWrapper = (props: ParentProps<ViewportWrapperProps>) => {
    const parentContext = useParentViewportContext();

    const [getPortalRef, setPortalRef] = createSignal<HTMLElement>();
    const [getHostRef, setHostRef] = createSignal<HTMLElement>();
    const [getAvailableSize, setAvailableSize] = createSignal<Size2d>(
        ViewportWrapperUtils.getInitialAvailableSize(!!parentContext),
        { equals: parentContext ? Size2d.isSame : undefined },
    );

    const getFit = createMemo(() => ViewportWrapperUtils.computeFit(access(props.size), getAvailableSize()));

    const getScale = createMemo(() => ViewportWrapperUtils.computeScale(getFit(), parentContext));

    const getScaledRect = () => ViewportWrapperUtils.computeScaledRect(getFit(), getHostRef(), parentContext);

    onMount(() => {
        onCleanup(ViewportWrapperUtils.observeAvailableSize(getHostRef(), !!parentContext, setAvailableSize));
    });

    return (
        <div ref={setHostRef} class={parentContext ? styles.viewportNestedHost : styles.viewportRootHost}>
            <div
                class={styles.viewportRoot}
                style={{
                    width: `${access(props.size).width}px`,
                    height: `${access(props.size).height}px`,
                    transform: ViewportWrapperUtils.computeTransform(getFit()),
                }}
            >
                <ViewportContextProvider
                    value={{
                        getPortalRef,
                        getSize: () => access(props.size),
                        getScale,
                        getScaledRect,
                    }}
                >
                    <div class={styles.viewportContent}>
                        <div ref={setPortalRef} class={styles.viewportPortal} />
                        {props.children}
                    </div>
                </ViewportContextProvider>
            </div>
        </div>
    );
};
