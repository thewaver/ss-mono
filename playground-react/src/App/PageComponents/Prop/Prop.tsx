import type { PropsWithChildren } from "react";
import { Fragment, useState } from "react";

import { Button } from "@thewaver/ss-components-react";
import {
    EMPTY_TEXT,
    HINT_OFFSET,
    HINT_PLACEMENT,
    MEMBER_SEPARATOR,
    SINGLE_FIELD,
} from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.const";
import * as styles from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.css";

import { PagePropHintBadge } from "../../StyledComponents/PropHintBadge/PropHintBadge";
import { PageTooltipContent } from "../../StyledComponents/TooltipContent/TooltipContent";
import type { FieldDefaultRegistry } from "../Field/FieldReact.context";
import { FieldDefaultProvider } from "../Field/FieldReact.context";
import { usePropsPanelContext } from "../PropsPanel/PropsPanel.context";
import type { PagePropProps } from "./Prop.types";

const toDefaultText = (value: unknown) => {
    if (typeof value === "boolean") return value ? "on" : "off";
    if (typeof value === "number") return String(value);
    if (typeof value === "string" && value !== EMPTY_TEXT) return value;

    return undefined;
};

const toBreakableText = (text: string) =>
    text.split(MEMBER_SEPARATOR).map((part, index) => (
        <Fragment key={index}>
            {index === 0 ? undefined : (
                <>
                    {MEMBER_SEPARATOR}
                    <wbr />
                </>
            )}
            {part}
        </Fragment>
    ));

export const PageProp = (props: PropsWithChildren<PagePropProps>) => {
    const propsPanelScope = usePropsPanelContext();

    const [reported, setReported] = useState<{ value: unknown }[]>([]);

    const [defaultRegistry] = useState<FieldDefaultRegistry>(() => ({
        report: (value) => {
            const entry = { value };

            setReported((entries) => [...entries, entry]);

            return () => setReported((entries) => entries.filter((candidate) => candidate !== entry));
        },
    }));

    const reportedDefault = reported.length === SINGLE_FIELD ? reported[0].value : undefined;

    const defaultText = toDefaultText(props.defaultValue === undefined ? reportedDefault : props.defaultValue);

    return (
        <div
            className={styles.propScopeVariants[propsPanelScope?.scope ?? "unknown"]}
            data-prop=""
            data-testid={props.itemKey}
        >
            <div className={styles.propLabel}>
                {props.label}

                <Button
                    ariaLabel={`About ${props.label}`}
                    tooltipDefs={{
                        placement: HINT_PLACEMENT,
                        offset: HINT_OFFSET,
                        renderContent: (visibilityTarget, transitionDurationMs) => (
                            <PageTooltipContent
                                visibilityTarget={visibilityTarget}
                                transitionDurationMs={transitionDurationMs}
                            >
                                {props.hint}

                                <div className={styles.propHintControls} data-hint-controls>
                                    {toBreakableText(props.controls)}
                                </div>

                                {defaultText && (
                                    <div className={styles.propHintDefault}>{`Default: ${defaultText}`}</div>
                                )}
                            </PageTooltipContent>
                        ),
                    }}
                    renderContent={(flags) => <PagePropHintBadge flags={flags} />}
                />
            </div>

            <FieldDefaultProvider value={defaultRegistry}>{props.children}</FieldDefaultProvider>
        </div>
    );
};
