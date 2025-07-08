import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";

function useNotificationObserver() {
  useEffect(() => {
    let isMounted = true;

    const redirect = (notification: Notifications.Notification) => {
      const url = notification.request.content.data?.url;
      if (url) {
        router.push(url);
      }
    };

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }

      setTimeout(() => {
        redirect(response?.notification);
      }, 1);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        setTimeout(() => {
          redirect(response.notification);
        }, 1);
      }
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}

export default useNotificationObserver;
