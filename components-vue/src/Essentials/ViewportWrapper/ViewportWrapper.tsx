import { type SlotsType, computed, defineComponent, shallowRef } from "vue";

import { ViewportWrapperStyles, ViewportWrapperUtils } from "@thewaver/ss-components";
import { Size2d } from "@thewaver/ss-utils";

import { provideViewportContext, useParentViewportContext } from "../../Abstracts/Viewport/Viewport.context";
import { watchAfterRender } from "../../Utils/effectUtils";
import { declareProps } from "../../Utils/propUtils";
import { toElement } from "../../Utils/refUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { ViewportWrapperProps, ViewportWrapperSlots } from "./ViewportWrapper.types";

export const ViewportWrapper = defineComponent(
    (props: ViewportWrapperProps, { slots }: SlotsContext<ViewportWrapperSlots>) => {
        const parentContext = useParentViewportContext();
        const isNested = parentContext !== undefined;

        const hostRef = shallowRef<HTMLDivElement>();
        const portal = shallowRef<HTMLElement>();
        const availableSize = shallowRef(ViewportWrapperUtils.getInitialAvailableSize(isNested));

        const fit = computed(() =>
            ViewportWrapperUtils.computeFit(
                { width: props.size.width, height: props.size.height },
                availableSize.value,
            ),
        );

        const scale = computed(() => ViewportWrapperUtils.computeScale(fit.value, parentContext));

        watchAfterRender([], () =>
            ViewportWrapperUtils.observeAvailableSize(hostRef.value, isNested, (size) => {
                if (isNested && Size2d.isSame(availableSize.value, size)) return;

                availableSize.value = size;
            }),
        );

        provideViewportContext({
            getPortalRef: () => portal.value,
            getSize: () => ({ width: props.size.width, height: props.size.height }),
            getScale: () => scale.value,
            getScaledRect: () => ViewportWrapperUtils.computeScaledRect(fit.value, hostRef.value, parentContext),
        });

        return () => (
            <div
                ref={hostRef}
                class={isNested ? ViewportWrapperStyles.viewportNestedHost : ViewportWrapperStyles.viewportRootHost}
            >
                <div
                    class={ViewportWrapperStyles.viewportRoot}
                    style={{
                        width: `${props.size.width}px`,
                        height: `${props.size.height}px`,
                        transform: ViewportWrapperUtils.computeTransform(fit.value),
                    }}
                >
                    <div class={ViewportWrapperStyles.viewportContent}>
                        <div
                            ref={(target) => {
                                portal.value = toElement(target);
                            }}
                            class={ViewportWrapperStyles.viewportPortal}
                        />
                        {slots.default?.()}
                    </div>
                </div>
            </div>
        );
    },
    {
        name: "ViewportWrapper",
        slots: Object as SlotsType<ViewportWrapperSlots>,
        props: declareProps<ViewportWrapperProps>({ size: null }),
    },
);
