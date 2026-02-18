import Peer, { DataConnection } from 'peerjs';

// Define message types for type safety
export type GameMessage =
  | { type: 'JOIN_REQUEST', payload: { playerName: string } }
  | { type: 'JOIN_REJECT', payload: { reason: string } }
  | { type: 'JOIN_ACCEPT', payload: { roomState: any, gameState?: any } }
  | { type: 'START_GAME', payload: { mode: string, topics: string[], questions: any[], relayState?: any, territoryState?: any } }
  | { type: 'SUBMIT_ANSWER', payload: { playerId: string, answer: any } }
  | { type: 'TERRITORY_ACTION', payload: { playerId: string, action: string, hexId?: string, isCorrect?: boolean, usedCard?: string } }
  | { type: 'UPDATE_STATE', payload: { gameState: any } }
  | { type: 'RELAY_UPDATE', payload: { team: string, score: number, nextPlayer: string } }
  | { type: 'CARD_NOTIFICATION', payload: { team: string, cardId: string, reason: string } }
  | { type: 'GAME_NOTIFICATION', payload: { icon?: string, title: string, message: string, color?: string } };

interface PeerServiceEvents {
  onConnection: (conn: DataConnection) => void;
  onData: (data: GameMessage, conn: DataConnection) => void;
  onDisconnected: () => void;
  onError: (err: any) => void;
}

class PeerService {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private events: PeerServiceEvents = {
    onConnection: () => { },
    onData: () => { },
    onDisconnected: () => { },
    onError: () => { },
  };

  // Initialize the Peer
  // We use a prefix to namespace our app on the public PeerJS server
  public readonly ID_PREFIX = 'mat10-quad-';

  constructor() { }

  // Set event handlers
  setCallbacks(callbacks: Partial<PeerServiceEvents>) {
    this.events = { ...this.events, ...callbacks };
  }

  private hostConnection: DataConnection | null = null;

  // Generate a random 4-digit code
  private generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, 1, O, 0 to avoid confusion
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Check if peer is initialized
  get isInitialized(): boolean {
    return this.peer !== null;
  }

  // Host: Create a room with a random 4-letter code
  // We try to claim an ID like "mat10-quad-ABCD"
  async createRoom(existingCode?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const code = existingCode || this.generateRoomCode();
      const peerId = this.ID_PREFIX + code;

      this.peer = new Peer(peerId, {
        debug: 2,
        secure: true, // Use SSL/TLS
      });

      this.peer.on('open', (id) => {
        console.log('My peer ID is: ' + id);
        resolve(code);
      });

      this.peer.on('connection', (conn) => {
        this.handleConnection(conn);
      });

      this.peer.on('error', (err) => {
        console.error('Peer error:', err);
        // If ID is taken, we should probably try another code, 
        // but for now let's just report the error
        this.events.onError(err);
        reject(err);
      });

      this.peer.on('disconnected', () => {
        this.events.onDisconnected();
      });
    });
  }

  // Client: Join a room by code
  async joinRoom(code: string, retryCount = 0): Promise<string> {
    return new Promise((resolve, reject) => {
      // Always destroy old peer instance when starting a new join sequence (retryCount === 0)
      // This prevents stale state from previous failed connections (e.g. auto-reconnect)
      if (this.peer && retryCount === 0) {
        console.log("Destroying previous peer instance for fresh connection...");
        this.peer.destroy();
        this.peer = null;
      }

      // If we are retrying, we also destroy to be safe, unless we want to keep the same ID? 
      // Actually, getting a new ID effectively resets the "route" to the host.
      if (this.peer && retryCount > 0) {
        this.peer.destroy();
        this.peer = null;
      }

      this.hostConnection = null; // Reset host connection

      // Client gets a random ID from PeerJS cloud
      if (!this.peer) {
        this.peer = new Peer({
          debug: 2,
          secure: true,
        });
      }

      this.peer.on('open', (id) => {
        console.log(`My client ID is: ${id} (Attempt ${retryCount + 1})`);

        // Connect to the host
        const hostId = this.ID_PREFIX + code.toUpperCase();
        console.log('Connecting to host:', hostId);

        const conn = this.peer!.connect(hostId, {
          reliable: true // Ensure delivery
        });

        // Set host connection reference
        this.hostConnection = conn;

        this.handleConnection(conn);

        // Connection timeout
        // Connection timeout
        const timeout = setTimeout(() => {
          if (conn.open) return; // Should be handled by open event, but safety check
          conn.close();
          // Retry on timeout
          if (retryCount < 2) {
            console.log("Connection timed out, retrying in 2s...");
            setTimeout(() => {
              resolve(this.joinRoom(code, retryCount + 1));
            }, 2000);
          } else {
            reject(new Error("A csatlakozás időtúllépés miatt sikertelen. Ellenőrizd a kódot vagy a netkapcsolatot! (PeerJS Timeout)"));
          }
        }, 30000); // 30s timeout per attempt

        // Wait for connection to actually open before resolving
        conn.on('open', () => {
          clearTimeout(timeout);
          resolve(id);
        });

        conn.on('error', (err) => {
          clearTimeout(timeout);
          console.error("Connection error:", err);
          this.hostConnection = null;
          // Retry on error
          if (retryCount < 2) {
            console.log("Connection failed, retrying...");
            resolve(this.joinRoom(code, retryCount + 1));
          } else {
            reject(err);
          }
        });

        conn.on('close', () => {
          clearTimeout(timeout);
          if (this.hostConnection === conn) {
            this.hostConnection = null;
          }
        });
      });

      this.peer.on('error', (err) => {
        // If the client's own peer errors out (e.g. socket closed)
        this.events.onError(err);
        if (retryCount < 2) {
          console.log("Peer error, retrying...", err);
          resolve(this.joinRoom(code, retryCount + 1));
        } else {
          reject(err);
        }
      });
    });
  }

  private handleConnection(conn: DataConnection) {
    conn.on('open', () => {
      console.log('Connection established:', conn.peer);
      this.connections.set(conn.peer, conn);
      this.events.onConnection(conn);
    });

    conn.on('data', (data) => {
      console.log('Received data:', data);
      this.events.onData(data as GameMessage, conn);
    });

    conn.on('close', () => {
      console.log('Connection closed:', conn.peer);
      this.connections.delete(conn.peer);
      if (this.hostConnection === conn) {
        this.hostConnection = null;
      }
    });

    conn.on('error', (err) => {
      console.error('Connection error:', err);
    });
  }

  // Send message to a specific peer
  send(peerId: string, message: GameMessage) {
    const conn = this.connections.get(peerId);
    if (conn && conn.open) {
      conn.send(message);
    } else {
      console.warn(`Cannot send to ${peerId}: connection not open`);
    }
  }

  // Helper for clients to send to the host (assuming single connection)
  sendToHost(message: GameMessage): boolean {
    if (this.hostConnection && this.hostConnection.open) {
      try {
        this.hostConnection.send(message);
        return true;
      } catch (err) {
        console.error("Failed to send to host:", err);
        return false;
      }
    } else {
      console.warn("No active connection to host found.");
      return false;
    }
  }

  // Broadcast message to all connected peers
  broadcast(message: GameMessage) {
    this.connections.forEach((conn) => {
      if (conn.open) {
        conn.send(message);
      }
    });
  }

  disconnect() {
    this.connections.forEach(conn => conn.close());
    this.connections.clear();
    this.hostConnection = null;
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
  }
}

export const peerService = new PeerService();
