import type { ParentProps } from "solid-js";
import { Show, createSignal } from "solid-js";

import { Button, access } from "@thewaver/ss-components";

import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { FieldResetProvider } from "../../StyledComponents/Field/Field.context";
import { PageProp } from "../Prop/Prop";
import { PropsPanelContextProvider } from "./PropsPanel.context";
import type { PagePropsPanelProps } from "./PropsPanel.types";

import * as styles from "./PropsPanel.css";

const NOTHING_TO_RESET = 0;
const SAMPLE_SELECTOR_ALONE = 1;

export const PagePropsGroups = (props: ParentProps) => <div class={styles.propsGroups}>{props.children}</div>;

export const PagePropsPanel = (props: ParentProps<PagePropsPanelProps>) => {
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

export const PagePropsDivider = () => <div class={styles.propsPanelDivider} role={"separator"} />;
