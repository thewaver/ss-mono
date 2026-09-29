import {
    type ComponentPublicInstance,
    type SlotsType,
    computed,
    defineComponent,
    onMounted,
    onUpdated,
    shallowRef,
} from "vue";

import { ElementMosaicStyles, MosaicUtils } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { Mosaic } from "../../../Primitives/Mosaic/Mosaic";
import type { MosaicSlots } from "../../../Primitives/Mosaic/Mosaic.types";
import { callSlot, declareProps } from "../../../Utils/propUtils";
import { toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { ElementMosaicProps, ElementMosaicSlots } from "./ElementMosaic.types";

const EMPTY_SIZE: Size2d = { width: 0, height: 0 };

export const ElementMosaic = defineComponent(
    <T,>(props: ElementMosaicProps<T>, { slots }: SlotsContext<ElementMosaicSlots<T>>) => {
        const elementsByIndex = new Map<number, HTMLElement>();

        const itemElements = shallowRef<Array<HTMLElement | undefined>>([]);

        const itemCount = computed(() => props.items.length);

        const collectElements = () => {
            const next = Array.from({ length: itemCount.value }, (_, index) => elementsByIndex.get(index));

            if (!MosaicUtils.getIsSameList(itemElements.value, next)) itemElements.value = next;
        };

        onMounted(collectElements);
        onUpdated(collectElements);

        const measuredSizes = ElementObserverVueUtils.useBorderBoxSizes(itemElements);

        const sizes = computed(() =>
            Array.from({ length: itemCount.value }, (_, index) => measuredSizes.value[index] ?? EMPTY_SIZE),
        );

        const setItemElement = (index: number, target: Element | ComponentPublicInstance | null) => {
            const element = toElement(target);

            if (element) {
                elementsByIndex.set(index, element);

                return;
            }

            elementsByIndex.delete(index);
        };

        return () => (
            <Mosaic
                sizeAnchor={props.sizeAnchor}
                gap={props.gap}
                transitionDurationMs={props.transitionDurationMs}
                sizes={sizes.value}
                keys={props.items}
                isItemSized={false}
                computePlacements={MosaicUtils.packFixed}
                ariaLabel={props.ariaLabel}
                onActivate={props.onActivate}
            >
                {
                    {
                        renderItem: ({ index, state }) => (
                            <div
                                ref={(target) => setItemElement(index, target)}
                                class={ElementMosaicStyles.elementMosaicItem}
                            >
                                {callSlot(slots.renderItem, { item: props.items[index], state })}
                            </div>
                        ),
                    } satisfies MosaicSlots
                }
            </Mosaic>
        );
    },
    {
        name: "ElementMosaic",
        slots: Object as SlotsType<ElementMosaicSlots<any>>,
        props: declareProps<ElementMosaicProps<unknown>>({
            sizeAnchor: null,
            gap: null,
            transitionDurationMs: null,
            ariaLabel: null,
            onActivate: null,
            items: null,
        }),
    },
);
