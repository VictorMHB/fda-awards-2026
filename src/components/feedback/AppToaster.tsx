"use client";

import { Toaster } from "sonner";
import { Check, Close } from "pixelarticons/react";

export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      icons={{
        success: <Check aria-hidden="true" width={18} height={18} />,
        error: <Close aria-hidden="true" width={18} height={18} />,
        warning: <span aria-hidden="true">!</span>,
        info: <span aria-hidden="true">i</span>,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "toast",
          content: "toast__content",
          title: "toast__title",
          description: "toast__description",
          icon: "toast__icon",
          success: "toast--success",
          error: "toast--error",
          warning: "toast--warning",
          info: "toast--info",
        },
      }}
    />
  );
}