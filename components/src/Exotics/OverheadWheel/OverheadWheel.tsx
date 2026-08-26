import { Wheel } from "../Wheel/Wheel";
import type { OverheadWheelProps } from "../Wheel/Wheel.types";

export const OverheadWheel = <T,>(props: OverheadWheelProps<T>) => <Wheel<T> {...props} variant={"overhead"} />;
