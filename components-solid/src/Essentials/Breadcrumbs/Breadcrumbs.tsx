import { Index, type JSX, Show, createMemo } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
    BREADCRUMBS_DEFAULTS,
    InteractionTrackerUtils,
    SafeHrefUtils,
    BreadcrumbsStyles as styles,
} from "@thewaver/ss-components";

import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { access } from "../../Utils/propUtils";
import type { BreadcrumbsItemProps, BreadcrumbsProps } from "./BreadcrumbsSolid.types";

const BreadcrumbsItem = <T,>(props: BreadcrumbsItemProps<T>) => {
    const getSafeHref = () => SafeHrefUtils.resolve(access(props.crumb).href, "Breadcrumbs");

    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    const handleClick = (e: MouseEvent) => {
        if (getIsDisabled()) {
            e.preventDefault();
            return;
        }

        if (getSafeHref() !== undefined && !InteractionTrackerUtils.getIsPlainClick(e)) return;

        props.onSelect(access(props.crumb).value);
    };

    const commonProps: Omit<JSX.HTMLAttributes<HTMLElement>, "ref"> = {
        "class": styles.breadcrumbsItem,
        get "id"() {
            return access(props.crumb).id;
        },
        get "aria-disabled"() {
            return getIsDisabled() || undefined;
        },
    };

    return (
        <Show
            when={!access(props.flags).isCurrent}
            fallback={
                <span
                    ref={(element) => props.ref?.(element)}
                    class={styles.breadcrumbsCurrent}
                    id={access(props.crumb).id}
                    aria-current="page"
                >
                    {props.renderContent(() => access(props.flags))}
                </span>
            }
        >
            <Show
                when={getSafeHref()}
                fallback={
                    <button
                        type="button"
                        ref={(element) => props.ref?.(element)}
                        {...commonProps}
                        onClick={handleClick}
                    >
                        {props.renderContent(() => access(props.flags))}
                    </button>
                }
            >
                <Dynamic
                    component={props.linkComponent ?? "a"}
                    ref={(element: HTMLElement) => props.ref?.(element)}
                    href={getSafeHref()!}
                    {...commonProps}
                    onClick={handleClick}
                >
                    {props.renderContent(() => access(props.flags))}
                </Dynamic>
            </Show>
        </Show>
    );
};

export const Breadcrumbs = <T,>(props: BreadcrumbsProps<T>) => {
    const getLastIndex = createMemo(() => access(props.crumbs).length - 1);

    return (
        <nav class={styles.breadcrumbsRoot} aria-label={access(props.ariaLabel)}>
            <ol class={styles.breadcrumbsList} style={{ gap: `${access(props.gap) ?? BREADCRUMBS_DEFAULTS.gap}px` }}>
                <Index each={access(props.crumbs)}>
                    {(getCrumb, index) => (
                        <li class={styles.breadcrumbsEntry}>
                            <InteractionWrapper
                                isDisabled={() => getCrumb().isDisabled ?? false}
                                isFocusableWhenDisabled={() => getCrumb().isReachableWhenDisabled ?? false}
                                isTabbable={() => index !== getLastIndex()}
                                extraFlags={() => ({ isCurrent: index === getLastIndex() })}
                                renderControl={(setElementRef, getFlags) => (
                                    <BreadcrumbsItem
                                        ref={setElementRef}
                                        crumb={getCrumb}
                                        flags={getFlags}
                                        linkComponent={props.linkComponent}
                                        renderContent={(getItemFlags) => props.renderCrumb(getCrumb, getItemFlags)}
                                        onSelect={(value) => props.onSelect?.(value)}
                                    />
                                )}
                            />

                            <Show when={props.renderSeparator === undefined ? undefined : index !== getLastIndex()}>
                                <span class={styles.breadcrumbsSeparator} aria-hidden="true">
                                    {props.renderSeparator!()}
                                </span>
                            </Show>
                        </li>
                    )}
                </Index>
            </ol>
        </nav>
    );
};
