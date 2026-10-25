import { type MouseEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    TABLE_OF_CONTENTS_DEFAULTS,
    type TableOfContentsFlags,
    type TableOfContentsLink,
    TableOfContentsStyles,
    TableOfContentsUtils,
} from "@thewaver/ss-components";
import { PlacementConst } from "@thewaver/ss-components/internal";

import { ElementObserverReactUtils } from "../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { useLatest, useStableList } from "../../Utils/refUtils";
import type { TableOfContentsItemProps, TableOfContentsProps } from "./TableOfContents.types";

const TableOfContentsItem = <T,>(props: TableOfContentsItemProps<T>) => {
    const handleClick = (e: MouseEvent<HTMLElement>) => {
        const target = props.link.target;

        if (!target) return;

        e.preventDefault();

        TableOfContentsUtils.goToTarget(target);
        props.onGo();
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

    const scrolledIndex = ElementObserverReactUtils.useCurrentIndex(targets, false, {
        offsetRatio: props.offsetRatio ?? TABLE_OF_CONTENTS_DEFAULTS.offsetRatio,
    });

    const [press, setPress] = useState<{ index: number }>();
    const [previousTargets, setPreviousTargets] = useState(targets);

    if (previousTargets !== targets) {
        setPreviousTargets(targets);
        setPress(undefined);
    }

    useEffect(() => {
        if (!press) return;

        return TableOfContentsUtils.observeNextReaderInput(() => setPress(undefined));
    }, [press]);

    const currentIndex = press?.index ?? scrolledIndex;

    const currentValue = TableOfContentsUtils.computeCurrentValue(links, currentIndex);
    const latestOnCurrentChange = useLatest(props.onCurrentChange);
    const reportedValueRef = useRef<T | undefined>(undefined);

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
                sizing={placement === undefined ? PlacementConst.ROW_SIZING : PlacementConst.PLACED_SIZING}
                extraFlags={{ isCurrent: currentIndex === index }}
                renderControl={(setElementRef, flags) => (
                    <TableOfContentsItem
                        ref={setElementRef}
                        link={link}
                        flags={flags}
                        onGo={() => setPress({ index })}
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
