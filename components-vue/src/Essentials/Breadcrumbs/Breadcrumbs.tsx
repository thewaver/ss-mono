import { type SlotsType, defineComponent, h } from "vue";

import { BREADCRUMBS_DEFAULTS, type BreadcrumbsFlags, BreadcrumbsStyles } from "@thewaver/ss-components";

import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import type {
    InteractionControlSlots,
    InteractionWrapperSlots,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { callSlot, declareProps } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { BreadcrumbsItemProps, BreadcrumbsProps, BreadcrumbsSlots } from "./Breadcrumbs.types";

const BreadcrumbsItem = defineComponent(
    <T,>(props: BreadcrumbsItemProps<T>, { slots }: SlotsContext<InteractionControlSlots<BreadcrumbsFlags>>) =>
        () => {
            const isDisabled = props.flags.isDisabled ?? false;

            const handleClick = (e: MouseEvent) => {
                if (isDisabled) {
                    e.preventDefault();

                    return;
                }

                props.onSelect(props.crumb.value);
            };

            const content = callSlot(slots.renderContent, props.flags);

            if (props.flags.isCurrent) {
                return (
                    <span class={BreadcrumbsStyles.breadcrumbsCurrent} id={props.crumb.id} aria-current="page">
                        {content}
                    </span>
                );
            }

            const commonProps = {
                "class": BreadcrumbsStyles.breadcrumbsItem,
                "id": props.crumb.id,
                "aria-disabled": isDisabled || undefined,
            };

            if (props.crumb.href === undefined) {
                return (
                    <button type="button" {...commonProps} onClick={handleClick}>
                        {content}
                    </button>
                );
            }

            if (props.linkComponent === undefined) {
                return (
                    <a href={props.crumb.href} {...commonProps} onClick={handleClick}>
                        {content}
                    </a>
                );
            }

            return h(
                props.linkComponent,
                { href: props.crumb.href, ...commonProps, onClick: handleClick },
                { default: () => content },
            );
        },
    {
        name: "BreadcrumbsItem",
        props: declareProps<BreadcrumbsItemProps<unknown>>({
            ariaLabel: null,
            flags: null,
            crumb: null,
            linkComponent: null,
            onSelect: null,
        }),
    },
);

export const Breadcrumbs = defineComponent(
    <T,>(props: BreadcrumbsProps<T>, { slots }: SlotsContext<BreadcrumbsSlots<T>>) =>
        () => {
            const lastIndex = props.crumbs.length - 1;

            return (
                <nav class={BreadcrumbsStyles.breadcrumbsRoot} aria-label={props.ariaLabel}>
                    <ol
                        class={BreadcrumbsStyles.breadcrumbsList}
                        style={{ gap: `${props.gap ?? BREADCRUMBS_DEFAULTS.gap}px` }}
                    >
                        {props.crumbs.map((crumb, index) => (
                            <li key={index} class={BreadcrumbsStyles.breadcrumbsEntry}>
                                <InteractionWrapper
                                    isDisabled={crumb.isDisabled ?? false}
                                    isFocusableWhenDisabled={crumb.isReachableWhenDisabled ?? false}
                                    isTabbable={index !== lastIndex}
                                    extraFlags={{ isCurrent: index === lastIndex }}
                                >
                                    {
                                        {
                                            renderControl: ({ setElementRef, flags }) => (
                                                <BreadcrumbsItem
                                                    ref={setElementRef}
                                                    crumb={crumb}
                                                    flags={flags}
                                                    linkComponent={props.linkComponent}
                                                    onSelect={(value) => props.onSelect?.(value)}
                                                >
                                                    {
                                                        {
                                                            renderContent: (itemFlags) =>
                                                                callSlot(slots.renderCrumb, {
                                                                    crumb,
                                                                    flags: itemFlags,
                                                                }),
                                                        } satisfies InteractionControlSlots<BreadcrumbsFlags>
                                                    }
                                                </BreadcrumbsItem>
                                            ),
                                        } satisfies Partial<InteractionWrapperSlots<BreadcrumbsFlags>>
                                    }
                                </InteractionWrapper>

                                {slots.renderSeparator && index !== lastIndex && (
                                    <span class={BreadcrumbsStyles.breadcrumbsSeparator} aria-hidden="true">
                                        {slots.renderSeparator()}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            );
        },
    {
        name: "Breadcrumbs",
        slots: Object as SlotsType<BreadcrumbsSlots<any>>,
        props: declareProps<BreadcrumbsProps<unknown>>({
            gap: null,
            ariaLabel: null,
            linkComponent: null,
            crumbs: null,
            onSelect: null,
        }),
    },
);
