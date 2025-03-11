// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { cubicBezier } from "framer-motion";

export const easeInOutCubic = cubicBezier(0.645, 0.045, 0.355, 1);
export const easeOutCubic = cubicBezier(0, 0, 0.58, 1);
