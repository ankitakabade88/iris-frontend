import { useDispatch, useSelector } from "react-redux";
import type {  TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

/* =====================================================
   TYPED REDUX HOOKS
===================================================== */

/* use instead of useDispatch() */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/* use instead of useSelector() */
export const useAppSelector: TypedUseSelectorHook<RootState> =
  useSelector;