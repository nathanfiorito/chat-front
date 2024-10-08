import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const SOCKET_URL = 'http://localhost:8080/chat';

class WebSocketService {
  private client: Client;
  private onMessageReceived?: (message: any) => void;

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),
      onConnect: () => {
        console.log('Connected');
        this.client.subscribe('/topic/messages', (message: IMessage) => {
          if (this.onMessageReceived) {
            this.onMessageReceived(JSON.parse(message.body));
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      }
    });
    this.client.activate();
  }

  sendMessage(message: any) {
    this.client.publish({
      destination: '/app/sendMessage',
      body: JSON.stringify(message)
    });
  }

  setOnMessageReceivedCallback(callback: (message: any) => void) {
    this.onMessageReceived = callback;
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;