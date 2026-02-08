import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectNotificationSocket = (jwtToken, onMessage) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    connectHeaders: {
      Authorization: `Bearer ${jwtToken}`,
    },
    onConnect: () => {
      console.log("🔔 WebSocket connected");

      stompClient.subscribe("/user/queue/notifications", (message) => {
        const notification = JSON.parse(message.body);
        onMessage(notification);
      });
    },
    onDisconnect: () => {
      console.log("🔕 WebSocket disconnected");
    },
  });

  stompClient.activate();
};

export const disconnectNotificationSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
};
