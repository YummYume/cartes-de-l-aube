import { toast } from 'vue3-toastify';

export const asyncToast = (asyncCallback, { successMsg, pendingMsg, failMsg }) =>
  toast.promise(asyncCallback, {
    pending: {
      render() {
        return pendingMsg;
      },
    },
    success: {
      render() {
        return successMsg;
      },
    },
    error: {
      render({ data }) {
        return failMsg || data;
      },
      autoClose: 500,
    },
  });
