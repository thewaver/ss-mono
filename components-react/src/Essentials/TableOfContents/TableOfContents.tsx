import { type MouseEvent, useEffect, useLayoutEffect, useMemo, useRef } from "react";

import {
    type InteractionSizing,
    TABLE_OF_CONTENTS_DEFAULTS,
    type TableOfContentsFlags,
    type TableOfContentsLink,
    TableOfContentsStyles,
    TableOfContentsUtils,
} from "@thewaver/ss-components";

import { ElementObserverReactUtils } from "../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { useLatest, useStableList } from "../../Utils/refUtils";
import type { TableOfContentsItemProps, TableOfContentsProps } from "./TableOfContents.types";

const ROW_SIZING: InteractionSizing = "fit-content";
const PLACED_SIZING: InteractionSizing = "fill";

const TableOfContentsItem = <T,>(props: TableOfContentsItemProps<T>) => {
    const handleClick = (e: MouseEvent<HTMLElement>) => {
        const target = props.link.target;

        if (!target) return;

        e.preventDefault();

        TableOfContentsUtils.goToTarget(target);
    };

    const commonProps = {
        "className": TableOfContentsStyles.tableOfContentsItem,
        "id": props.link.id,
        "aria-current": props.flags.isCurrent ? ("location" as const) : undefined,
    };

    if (props.link.href === undefined) {
        return (
            <button type="button" ref={props.ref} {...commonProps} onClick={handleClick}>
                {props.renderContent(props.flags)}
            </button>
        );
    }

    return (
        <a ref={props.ref} href={props.link.href} {...commonProps} onClick={handleClick}>
            {props.renderContent(props.flags)}
        </a>
    );
};

export const TableOfContents = <T,>(props: TableOfContentsProps<T>) => {
    const orientation = props.orientation ?? TABLE_OF_CONTENTS_DEFAULTS.orientation;
    const flexDirection = orientation === "horizontal" ? "row" : "column";
    const links = props.links;
    const itemCount = links.length;

    const targets = useStableList(links.map((link) => link.target));

    const currentIndex = ElementObserverReactUtils.useCurrentIndex(targets, false, {
        offsetRatio: props.offsetRatio ?? TABLE_OF_CONTENTS_DEFAULTS.offsetRatio,
    });

    const currentValue = TableOfContentsUtils.computeCurrentValue(links, currentIndex);
    const latestOnCurrentChange = useLatest(props.onCurrentChange);
    const reportedValueRef = useRef(currentValue);

    useEffect(() => {
        if (reportedValueRef.current === currentValue) return;

        reportedValueRef.current = currentValue;
        latestOnCurrentChange.current?.(currentValue);
    }, [currentValue, latestOnCurrentChange]);

    useLayoutEffect(() => TableOfContentsUtils.makeTargetsFocusable(targets), [targets]);

    const computeLayout = props.computeLayout;
    const layout = useMemo(() => computeLayout?.({ itemCount }), [computeLayout, itemCount]);

    const renderControl = (link: TableOfContentsLink<T>, index: number) => {
        const placement = layout?.placements[index];

        return (
            <InteractionWrapper<TableOfContentsFlags>
                sizing={placement === undefined ? ROW_SIZING : PLACED_SIZING}
                extraFlags={{ isCurrent: currentIndex === index }}
                renderControl={(setElementRef, flags) => (
                    <TableOfContentsItem
                        ref={setElementRef}
                        link={link}
                        flags={flags}
                        renderContent={(itemFlags) => props.renderLink(link, itemFlags, placement)}
                    />
                )}
            />
        );
    };

    const renderPlacedEntry = (link: TableOfContentsLink<T>, index: number) => {
        const placement = layout?.placements[index];

        return (
            <li key={index} className={TableOfContentsStyles.tableOfContentsLayer}>
                {placement && <PlacementItem placement={placement}>{renderControl(link, index)}</PlacementItem>}
            </li>
        );
    };

    const renderEntry = (link: TableOfContentsLink<T>, index: number) => (
        <li key={index} className={TableOfContentsStyles.tableOfContentsEntry}>
            {renderControl(link, index)}
        </li>
    );

    const list = (
        <ol
            className={[
                TableOfContentsStyles.tableOfContentsList,
                layout !== undefined && TableOfContentsStyles.tableOfContentsPlacedList,
            ]
                .filter(Boolean)
                .join(" ")}
            style={{
                flexDirection: layout === undefined ? flexDirection : undefined,
                flexWrap: layout === undefined && orientation === "horizontal" ? "wrap" : undefined,
                gap: layout === undefined ? `${props.gap ?? TABLE_OF_CONTENTS_DEFAULTS.gap}px` : undefined,
            }}
        >
            {links.map((link, index) =>
                layout === undefined ? renderEntry(link, index) : renderPlacedEntry(link, index),
            )}
        </ol>
    );

    return (
        <nav
            className={TableOfContentsStyles.tableOfContentsRoot}
            aria-label={props.ariaLabel}
            aria-labelledby={props.ariaLabelledBy}
        >
            {layout ? (
                <PlacementBox layout={layout} computeEffect={props.computeEffect}>
                    {list}
                </PlacementBox>
            ) : (
                list
            )}
        </nav>
    );
};
