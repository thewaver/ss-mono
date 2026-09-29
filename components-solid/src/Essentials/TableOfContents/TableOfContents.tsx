import { type Accessor, Index, type JSX, Show, createEffect, createMemo, on, onCleanup } from "solid-js";

import {
    type InteractionSizing,
    TABLE_OF_CONTENTS_DEFAULTS,
    type TableOfContentsFlags,
    type TableOfContentsLink,
    TableOfContentsUtils,
    TableOfContentsStyles as styles,
} from "@thewaver/ss-components";

import { ElementObserverSolidUtils } from "../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { access } from "../../Utils/propUtils";
import type { TableOfContentsItemProps, TableOfContentsProps } from "./TableOfContentsSolid.types";

const ROW_SIZING: InteractionSizing = "fit-content";
const PLACED_SIZING: InteractionSizing = "fill";

const TableOfContentsItem = <T,>(props: TableOfContentsItemProps<T>) => {
    const handleClick = (e: MouseEvent) => {
        const target = access(props.link).target;

        if (!target) return;

        e.preventDefault();

        TableOfContentsUtils.goToTarget(target);
    };

    const commonProps: Omit<JSX.HTMLAttributes<HTMLElement>, "ref"> = {
        "class": styles.tableOfContentsItem,
        get "id"() {
            return access(props.link).id;
        },
        get "aria-current"() {
            return access(props.flags).isCurrent ? "location" : undefined;
        },
    };

    return (
        <Show
            when={access(props.link).href}
            fallback={
                <button type="button" ref={(element) => props.ref?.(element)} {...commonProps} onClick={handleClick}>
                    {props.renderContent(() => access(props.flags))}
                </button>
            }
        >
            {(getHref) => (
                <a ref={(element) => props.ref?.(element)} href={getHref()} {...commonProps} onClick={handleClick}>
                    {props.renderContent(() => access(props.flags))}
                </a>
            )}
        </Show>
    );
};

export const TableOfContents = <T,>(props: TableOfContentsProps<T>) => {
    const getOrientation = createMemo(() => access(props.orientation) ?? TABLE_OF_CONTENTS_DEFAULTS.orientation);

    const getFlexDirection = createMemo(() => (getOrientation() === "horizontal" ? "row" : "column"));

    const getTargets = createMemo(() => access(props.links).map((link) => link.target));

    const getCurrentIndex = ElementObserverSolidUtils.createViewportCurrentIndexObserver(getTargets, undefined, {
        getOffsetRatio: () => access(props.offsetRatio) ?? TABLE_OF_CONTENTS_DEFAULTS.offsetRatio,
    });

    const getCurrentValue = createMemo(() =>
        TableOfContentsUtils.computeCurrentValue(access(props.links), getCurrentIndex()),
    );

    createEffect(on(getCurrentValue, (value) => props.onCurrentChange?.(value), { defer: true }));

    createEffect(() => {
        onCleanup(TableOfContentsUtils.makeTargetsFocusable(getTargets()));
    });

    const getLayout = createMemo(() => props.computeLayout?.({ itemCount: access(props.links).length }));

    const getPlacementAt = (index: number) => getLayout()?.placements[index];

    const renderControl = (getLink: Accessor<TableOfContentsLink<T>>, index: number) => (
        <InteractionWrapper<TableOfContentsFlags>
            sizing={getPlacementAt(index) === undefined ? ROW_SIZING : PLACED_SIZING}
            extraFlags={() => ({ isCurrent: getCurrentIndex() === index })}
            renderControl={(setElementRef, getFlags) => (
                <TableOfContentsItem
                    ref={setElementRef}
                    link={getLink}
                    flags={getFlags}
                    renderContent={(getItemFlags) =>
                        props.renderLink(getLink, getItemFlags, () => getPlacementAt(index))
                    }
                />
            )}
        />
    );

    const renderPlacedEntry = (getLink: Accessor<TableOfContentsLink<T>>, index: number) => (
        <li class={styles.tableOfContentsLayer}>
            <Show when={getPlacementAt(index)}>
                {(getRect) => <PlacementItem placement={getRect}>{renderControl(getLink, index)}</PlacementItem>}
            </Show>
        </li>
    );

    const renderEntry = (getLink: Accessor<TableOfContentsLink<T>>, index: number) => (
        <li class={styles.tableOfContentsEntry}>{renderControl(getLink, index)}</li>
    );

    const renderList = () => (
        <ol
            class={styles.tableOfContentsList}
            classList={{ [styles.tableOfContentsPlacedList]: getLayout() !== undefined }}
            style={{
                "flex-direction": getLayout() === undefined ? getFlexDirection() : undefined,
                "flex-wrap": getLayout() === undefined && getOrientation() === "horizontal" ? "wrap" : undefined,
                "gap":
                    getLayout() === undefined ? `${access(props.gap) ?? TABLE_OF_CONTENTS_DEFAULTS.gap}px` : undefined,
            }}
        >
            <Index each={access(props.links)}>
                {(getLink, index) =>
                    getLayout() === undefined ? renderEntry(getLink, index) : renderPlacedEntry(getLink, index)
                }
            </Index>
        </ol>
    );

    return (
        <nav
            class={styles.tableOfContentsRoot}
            aria-label={access(props.ariaLabel)}
            aria-labelledby={access(props.ariaLabelledBy)}
        >
            <Show when={getLayout()} fallback={renderList()}>
                {(getResolved) => (
                    <PlacementBox layout={getResolved} computeEffect={props.computeEffect}>
                        {renderList()}
                    </PlacementBox>
                )}
            </Show>
        </nav>
    );
};
