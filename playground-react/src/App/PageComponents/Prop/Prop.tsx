import type { PropsWithChildren } from "react";
import { useState } from "react";

import { Button } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/PageComponents/Prop/Prop.css";

import { PagePropHintBadge } from "../../StyledComponents/PropHintBadge/PropHintBadge";
import { PageTooltipContent } from "../../StyledComponents/TooltipContent/TooltipContent";
import type { FieldDefaultRegistry } from "../Field/Field.context";
import { FieldDefaultProvider } from "../Field/Field.context";
import { usePropsPanelContext } from "../PropsPanel/PropsPanel.context";
import type { PagePropProps } from "./Prop.types";

const HINT_PLACEMENT = { x: "center", y: "top-out" } as const;
const HINT_OFFSET = { x: 0, y: 10 };
const EMPTY_TEXT = "";
const SINGLE_FIELD = 1;

const toDefaultText = (value: unknown) => {
    if (typeof value === "boolean") return value ? "on" : "off";
    if (typeof value === "number") return String(value);
    if (typeof value === "string" && value !== EMPTY_TEXT) return value;

    return undefined;
};

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
