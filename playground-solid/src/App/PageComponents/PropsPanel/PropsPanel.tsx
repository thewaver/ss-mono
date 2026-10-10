import type { ParentProps } from "solid-js";
import { Show, createSignal } from "solid-js";

import { Button, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/PageComponents/PropsPanel/PropsPanel.css";

import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { FieldResetProvider } from "../Field/Field.context";
import { useIsPreview } from "../Preview/Preview.context";
import { PageProp } from "../Prop/Prop";
import { PropsPanelContextProvider } from "./PropsPanel.context";
import type { PagePropsPanelProps } from "./PropsPanel.types";

const NOTHING_TO_RESET = 0;
const SAMPLE_SELECTOR_ALONE = 1;

export const PagePropsGroups = (props: ParentProps) => {
    if (useIsPreview()) return null;

    return <div class={styles.propsGroups}>{props.children}</div>;
};

export const PagePropsPanel = (props: ParentProps<PagePropsPanelProps>) => {
    if (useIsPreview()) return null;

    const [getResets, setResets] = createSignal<(() => void)[]>([]);

    const getIsSampleScope = () => access(props.scope) === "sample";

    const getLeastToReset = () => (getIsSampleScope() ? SAMPLE_SELECTOR_ALONE : NOTHING_TO_RESET);

    const getResettable = () => (getIsSampleScope() ? getResets().slice(SAMPLE_SELECTOR_ALONE) : getResets());

    const register = (reset: () => void) => {
        setResets((list) => [...list, reset]);

        return () => setResets((list) => list.filter((entry) => entry !== reset));
    };

    return (
        <div class={styles.propsPanelScopeVariants[access(props.scope)]} data-panel={access(props.scope)}>
            <FieldResetProvider value={{ register }}>
                <PropsPanelContextProvider value={{ scope: props.scope }}>
                    {props.children}

                    <Show when={getResets().length > getLeastToReset()}>
                        <PageProp
                            key={"resetPanel"}
                            label={"These controls"}
                            hint={"Puts every control in this panel back to the value it started at."}
                        >
                            <Button
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>Reset</PageButtonContent>
                                )}
                                onClick={() => {
                                    getResettable().forEach((reset) => reset());
                                }}
                            />
                        </PageProp>
                    </Show>
                </PropsPanelContextProvider>
            </FieldResetProvider>
        </div>
    );
};

export const PagePropsDivider = () => {
    if (useIsPreview()) return null;

    return <div class={styles.propsPanelDivider} role={"separator"} />;
};
