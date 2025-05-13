import { toast } from "sonner";

type NotificationType = "success" | "error" | "loading";

interface NotificationOptions {
  duration?: number;
  description?: string;
}

export function useNotification() {
  const show = (
    type: NotificationType,
    message: string,
    options: NotificationOptions = {}
  ) => {
    const { duration = 2000, description } = options;

    switch (type) {
      case "success":
        toast.success(message, { duration, description });
        break;
      case "error":
        toast.error(message, { duration, description });
        break;
      case "loading":
        toast.loading(message, { duration, description });
        break;
    }
  };

  return { show };
} 