import type { MouseEvent } from "react";

import { BREADCRUMBS_DEFAULTS, type BreadcrumbsFlags, BreadcrumbsStyles } from "@thewaver/ss-components";

import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import type { BreadcrumbsItemProps, BreadcrumbsProps } from "./Breadcrumbs.types";

const BreadcrumbsItem = <T,>(props: BreadcrumbsItemProps<T>) => {
    const isDisabled = props.flags.isDisabled ?? false;

    const handleClick = (e: MouseEvent<HTMLElement>) => {
        if (isDisabled) {
            e.preventDefault();

            return;
        }

        props.onSelect(props.crumb.value);
    };

    if (props.flags.isCurrent) {
        return (
            <span
                ref={props.ref}
                className={BreadcrumbsStyles.breadcrumbsCurrent}
                id={props.crumb.id}
                aria-current="page"
            >
                {props.renderContent(props.flags)}
            </span>
        );
    }

    const commonProps = {
        "className": BreadcrumbsStyles.breadcrumbsItem,
        "id": props.crumb.id,
        "aria-disabled": isDisabled || undefined,
    };

    if (props.crumb.href === undefined) {
        return (
            <button type="button" ref={props.ref} {...commonProps} onClick={handleClick}>
                {props.renderContent(props.flags)}
            </button>
        );
    }

    const Link = props.linkComponent ?? "a";

    return (
        <Link ref={props.ref} href={props.crumb.href} {...commonProps} onClick={handleClick}>
            {props.renderContent(props.flags)}
        </Link>
    );
};

export const Breadcrumbs = <T,>(props: BreadcrumbsProps<T>) => {
    const lastIndex = props.crumbs.length - 1;

    return (
        <nav className={BreadcrumbsStyles.breadcrumbsRoot} aria-label={props.ariaLabel}>
            <ol
                className={BreadcrumbsStyles.breadcrumbsList}
                style={{ gap: `${props.gap ?? BREADCRUMBS_DEFAULTS.gap}px` }}
            >
                {props.crumbs.map((crumb, index) => (
                    <li key={index} className={BreadcrumbsStyles.breadcrumbsEntry}>
                        <InteractionWrapper<BreadcrumbsFlags>
                            isDisabled={crumb.isDisabled ?? false}
                            isFocusableWhenDisabled={crumb.isReachableWhenDisabled ?? false}
                            isTabbable={index !== lastIndex}
                            extraFlags={{ isCurrent: index === lastIndex }}
                            renderControl={(setElementRef, flags) => (
                                <BreadcrumbsItem
                                    ref={setElementRef}
                                    crumb={crumb}
                                    flags={flags}
                                    linkComponent={props.linkComponent}
                                    renderContent={(itemFlags) => props.renderCrumb(crumb, itemFlags)}
                                    onSelect={(value) => props.onSelect?.(value)}
                                />
                            )}
                        />

                        {props.renderSeparator && index !== lastIndex && (
                            <span className={BreadcrumbsStyles.breadcrumbsSeparator} aria-hidden="true">
                                {props.renderSeparator()}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};
