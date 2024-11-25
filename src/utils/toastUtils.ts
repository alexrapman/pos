// src/utils/toastUtils.ts
import { useToast } from '../hooks/useToast';

export const useToastUtils = () => {
    const { toast } = useToast();

    const notifySuccess = (message: string, duration?: number) => {
        toast.success(message, duration);
    };

    const notifyError = (message: string, duration?: number) => {
        toast.error(message, duration);
    };

    const notifyWarning = (message: string, duration?: number) => {
        toast.warning(message, duration);
    };

    const notifyInfo = (message: string, duration?: number) => {
        toast.info(message, duration);
    };

    return { notifySuccess, notifyError, notifyWarning, notifyInfo };
};