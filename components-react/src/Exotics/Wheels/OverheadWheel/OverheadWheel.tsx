import { Wheel } from "../../../Primitives/Wheel/Wheel";
import type { OverheadWheelProps } from "../../../Primitives/Wheel/Wheel.types";

export const OverheadWheel = <T,>(props: OverheadWheelProps<T>) => <Wheel<T> {...props} variant={"overhead"} />;
