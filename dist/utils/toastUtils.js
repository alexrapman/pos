"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToastUtils = void 0;
// src/utils/toastUtils.ts
const useToast_1 = require("../hooks/useToast");
const useToastUtils = () => {
    const { toast } = (0, useToast_1.useToast)();
    const notifySuccess = (message, duration) => {
        toast.success(message, duration);
    };
    const notifyError = (message, duration) => {
        toast.error(message, duration);
    };
    const notifyWarning = (message, duration) => {
        toast.warning(message, duration);
    };
    const notifyInfo = (message, duration) => {
        toast.info(message, duration);
    };
    return { notifySuccess, notifyError, notifyWarning, notifyInfo };
};
exports.useToastUtils = useToastUtils;
