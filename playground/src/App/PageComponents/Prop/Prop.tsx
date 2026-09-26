import type { ParentProps } from "solid-js";
import { Show, createSignal } from "solid-js";

import { Button, access } from "@thewaver/ss-components";

import { PagePropHintBadge } from "../../StyledComponents/PropHintBadge/PropHintBadge";
import { PageTooltipContent } from "../../StyledComponents/TooltipContent/TooltipContent";
import { FieldDefaultProvider } from "../Field/Field.context";
import { usePropsPanelContext } from "../PropsPanel/PropsPanel.context";
import type { PagePropProps } from "./Prop.types";

import * as styles from "./Prop.css";

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

export const PageProp = (props: ParentProps<PagePropProps>) => {
    const propsPanelScope = usePropsPanelContext();

    const [getReported, setReported] = createSignal<{ value: unknown }[]>([]);

    const report = (value: unknown) => {
        const entry = { value };

        setReported((entries) => [...entries, entry]);

        return () => setReported((entries) => entries.filter((candidate) => candidate !== entry));
    };

    const getReportedDefault = () => (getReported().length === SINGLE_FIELD ? getReported()[0].value : undefined);

    const getDefaultText = () =>
        toDefaultText(props.defaultValue === undefined ? getReportedDefault() : access(props.defaultValue));

    return (
        <div
            class={styles.propScopeVariants[(propsPanelScope ? access(propsPanelScope.scope) : undefined) ?? "unknown"]}
            data-prop
            data-testid={access(props.key)}
        >
            <div class={styles.propLabel}>
                {access(props.label)}

                <Button
                    ariaLabel={() => `About ${access(props.label)}`}
                    tooltipDefs={() => ({
                        placement: () => HINT_PLACEMENT,
                        offset: () => HINT_OFFSET,
                        renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                            <PageTooltipContent
                                visibilityTarget={getVisibilityTarget}
                                transitionDurationMs={getTransitionDurationMs}
                            >
                                {access(props.hint)}

                                <Show when={getDefaultText()}>
                                    {(getText) => <div class={styles.propHintDefault}>{`Default: ${getText()}`}</div>}
                                </Show>
                            </PageTooltipContent>
                        ),
                    })}
                    renderContent={(getFlags) => <PagePropHintBadge flags={getFlags} />}
                />
            </div>

            <FieldDefaultProvider value={{ report }}>{props.children}</FieldDefaultProvider>
        </div>
    );
};
