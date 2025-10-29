import { writable } from "svelte/store";

export interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

export const notifications = writable<Notification[]>([
  {
    id: 1,
    message: "New login from Chrome on Windows",
    time: "2 mins ago",
    read: false,
  },
  {
    id: 2,
    message: "Backup completed successfully",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    message: "Server CPU usage above 90%",
    time: "3 hours ago",
    read: true,
  },
  { id: 4, message: "User account updated", time: "Yesterday", read: true },
]);

// Mark all as read fonksiyonu
export function markAllAsRead() {
  notifications.update((n) => n.map((notif) => ({ ...notif, read: true })));
}
