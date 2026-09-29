import { type SlotsType, computed, defineComponent, watch } from "vue";

import {
    type InteractionSizing,
    TABLE_OF_CONTENTS_DEFAULTS,
    type TableOfContentsFlags,
    type TableOfContentsLink,
    TableOfContentsStyles,
    TableOfContentsUtils,
} from "@thewaver/ss-components";

import { ElementObserverVueUtils } from "../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import type {
    InteractionControlSlots,
    InteractionWrapperSlots,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps } from "../../Utils/propUtils";
import { useStableList } from "../../Utils/refUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { TableOfContentsItemProps, TableOfContentsProps, TableOfContentsSlots } from "./TableOfContents.types";

const ROW_SIZING: InteractionSizing = "fit-content";
const PLACED_SIZING: InteractionSizing = "fill";

const TableOfContentsItem = defineComponent(
    <T,>(
        props: TableOfContentsItemProps<T>,
        { slots }: SlotsContext<InteractionControlSlots<TableOfContentsFlags>>,
    ) =>
        () => {
            const handleClick = (e: MouseEvent) => {
                const target = props.link.target;

                if (!target) return;

                e.preventDefault();

                TableOfContentsUtils.goToTarget(target);
            };

            const commonProps = {
                "class": TableOfContentsStyles.tableOfContentsItem,
                "id": props.link.id,
                "aria-current": props.flags.isCurrent ? ("location" as const) : undefined,
            };

            const content = callSlot(slots.renderContent, props.flags);

            if (props.link.href === undefined) {
                return (
                    <button type="button" {...commonProps} onClick={handleClick}>
                        {content}
                    </button>
                );
            }

            return (
                <a href={props.link.href} {...commonProps} onClick={handleClick}>
                    {content}
                </a>
            );
        },
    {
        name: "TableOfContentsItem",
        props: declareProps<TableOfContentsItemProps<unknown>>({ ariaLabel: null, flags: null, link: null }),
    },
);

export const TableOfContents = defineComponent(
    <T,>(props: TableOfContentsProps<T>, { slots }: SlotsContext<TableOfContentsSlots<T>>) => {
        const targets = useStableList(() => props.links.map((link) => link.target));

        const currentIndex = ElementObserverVueUtils.useCurrentIndex(targets, false, {
            offsetRatio: () => props.offsetRatio ?? TABLE_OF_CONTENTS_DEFAULTS.offsetRatio,
        });

        const currentValue = computed(() => TableOfContentsUtils.computeCurrentValue(props.links, currentIndex.value));

        watch(
            currentValue,
            (value) => {
                props.onCurrentChange?.(value);
            },
            { flush: "post" },
        );

        watchAfterRender([targets], ([list]) => TableOfContentsUtils.makeTargetsFocusable(list));

        const itemCount = computed(() => props.links.length);
        const layout = computed(() => props.computeLayout?.({ itemCount: itemCount.value }));

        return () => {
            const orientation = props.orientation ?? TABLE_OF_CONTENTS_DEFAULTS.orientation;
            const flexDirection = orientation === "horizontal" ? "row" : "column";
            const currentLayout = layout.value;

            const renderControl = (link: TableOfContentsLink<T>, index: number) => {
                const placement = currentLayout?.placements[index];

                return (
                    <InteractionWrapper
                        sizing={placement === undefined ? ROW_SIZING : PLACED_SIZING}
                        extraFlags={{ isCurrent: currentIndex.value === index }}
                    >
                        {
                            {
                                renderControl: ({ setElementRef, flags }) => (
                                    <TableOfContentsItem ref={setElementRef} link={link} flags={flags}>
                                        {
                                            {
                                                renderContent: (itemFlags) =>
                                                    callSlot(slots.renderLink, { link, flags: itemFlags, placement }),
                                            } satisfies InteractionControlSlots<TableOfContentsFlags>
                                        }
                                    </TableOfContentsItem>
                                ),
                            } satisfies Partial<InteractionWrapperSlots<TableOfContentsFlags>>
                        }
                    </InteractionWrapper>
                );
            };

            const renderPlacedEntry = (link: TableOfContentsLink<T>, index: number) => {
                const placement = currentLayout?.placements[index];

                return (
                    <li key={index} class={TableOfContentsStyles.tableOfContentsLayer}>
                        {placement && (
                            <PlacementItem placement={placement}>
                                {{ default: () => renderControl(link, index) }}
                            </PlacementItem>
                        )}
                    </li>
                );
            };

            const renderEntry = (link: TableOfContentsLink<T>, index: number) => (
                <li key={index} class={TableOfContentsStyles.tableOfContentsEntry}>
                    {renderControl(link, index)}
                </li>
            );

            const list = (
                <ol
                    class={[
                        TableOfContentsStyles.tableOfContentsList,
                        currentLayout !== undefined && TableOfContentsStyles.tableOfContentsPlacedList,
                    ]}
                    style={{
                        flexDirection: currentLayout === undefined ? flexDirection : undefined,
                        flexWrap: currentLayout === undefined && orientation === "horizontal" ? "wrap" : undefined,
                        gap:
                            currentLayout === undefined
                                ? `${props.gap ?? TABLE_OF_CONTENTS_DEFAULTS.gap}px`
                                : undefined,
                    }}
                >
                    {props.links.map((link, index) =>
                        currentLayout === undefined ? renderEntry(link, index) : renderPlacedEntry(link, index),
                    )}
                </ol>
            );

            return (
                <nav
                    class={TableOfContentsStyles.tableOfContentsRoot}
                    aria-label={props.ariaLabel}
                    aria-labelledby={props.ariaLabelledBy}
                >
                    {currentLayout ? (
                        <PlacementBox layout={currentLayout} computeEffect={props.computeEffect}>
                            {{ default: () => list }}
                        </PlacementBox>
                    ) : (
                        list
                    )}
                </nav>
            );
        };
    },
    {
        name: "TableOfContents",
        slots: Object as SlotsType<TableOfContentsSlots<any>>,
        props: declareProps<TableOfContentsProps<unknown>>({
            ariaLabel: null,
            ariaLabelledBy: null,
            orientation: null,
            gap: null,
            offsetRatio: null,
            links: null,
            computeLayout: null,
            computeEffect: null,
            onCurrentChange: null,
        }),
    },
);
