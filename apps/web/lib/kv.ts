import { createClient, VercelKV } from "@vercel/kv";

// Custom KV interface
export interface KVStore {
  get<T = any>(key: string): Promise<T | null>;
  set(key: string, value: any, options?: { ex?: number; px?: number }): Promise<"OK">;
  setex(key: string, seconds: number, value: any): Promise<"OK">;
  del(...keys: string[]): Promise<number>;
  exists(...keys: string[]): Promise<number>;
  incr(key: string): Promise<number>;
  decr(key: string): Promise<number>;
  keys(pattern?: string): Promise<string[]>;
  flushall(): Promise<"OK">;
  hget<TData = string>(key: string, field: string): Promise<TData | null>;
  hset<TData>(key: string, kv: Record<string, TData>): Promise<number>;
  hdel(key: string, ...fields: string[]): Promise<0 | 1>;
  hgetall<TData extends Record<string, unknown>>(key: string): Promise<TData | null>;
}

// Development KV implementation - in-memory store
class DevKVStore implements KVStore {
  private store = new Map<string, any>();

  async get<T = any>(key: string): Promise<T | null> {
    return this.store.get(key) ?? null;
  }

  async set(
    key: string,
    value: any,
    options?: { ex?: number; px?: number }
  ): Promise<"OK"> {
    this.store.set(key, value);

    // Handle expiration if provided
    if (options?.ex) {
      setTimeout(() => this.store.delete(key), options.ex * 1000);
    } else if (options?.px) {
      setTimeout(() => this.store.delete(key), options.px);
    }

    return "OK";
  }

  async setex(key: string, seconds: number, value: any): Promise<"OK"> {
    this.store.set(key, value);
    setTimeout(() => this.store.delete(key), seconds * 1000);
    return "OK";
  }

  async del(...keys: string[]): Promise<number> {
    let deleted = 0;
    for (const key of keys) {
      if (this.store.delete(key)) {
        deleted++;
      }
    }
    return deleted;
  }

  async exists(...keys: string[]): Promise<number> {
    return keys.filter((key) => this.store.has(key)).length;
  }

  async incr(key: string): Promise<number> {
    const current = this.store.get(key) ?? 0;
    const newValue = Number(current) + 1;
    this.store.set(key, newValue);
    return newValue;
  }

  async decr(key: string): Promise<number> {
    const current = this.store.get(key) ?? 0;
    const newValue = Number(current) - 1;
    this.store.set(key, newValue);
    return newValue;
  }

  async keys(pattern?: string): Promise<string[]> {
    const allKeys = Array.from(this.store.keys());
    if (!pattern) return allKeys;

    // Simple pattern matching (supports * wildcard)
    const regex = new RegExp(pattern.replace(/\*/g, ".*"));
    return allKeys.filter((key) => regex.test(key));
  }

  async flushall(): Promise<"OK"> {
    this.store.clear();
    return "OK";
  }

  async hget<TData = string>(
    key: string,
    field: string
  ): Promise<TData | null> {
    const hash = this.store.get(key);
    return hash?.[field] ?? null;
  }

  async hset<TData>(key: string, kv: Record<string, TData>): Promise<number> {
    const hash = this.store.get(key) ?? {};
    let newFields = 0;

    for (const [field, value] of Object.entries(kv)) {
      if (!(field in hash)) {
        newFields++;
      }
      hash[field] = value;
    }

    this.store.set(key, hash);
    return newFields;
  }

  async hdel(key: string, ...fields: string[]): Promise<0 | 1> {
    const hash = this.store.get(key);
    if (!hash) return 0;

    let deleted = false;
    for (const field of fields) {
      if (field in hash) {
        delete hash[field];
        deleted = true;
      }
    }

    this.store.set(key, hash);
    return deleted ? 1 : 0;
  }

  async hgetall<TData extends Record<string, unknown>>(
    key: string
  ): Promise<TData | null> {
    return this.store.get(key) ?? null;
  }
}

// Vercel KV implementation - forwards to Vercel KV functions
class VercelKVStore implements KVStore {
  private client: VercelKV;

  constructor(client: VercelKV) {
    this.client = client;
  }

  async get<T = any>(key: string): Promise<T | null> {
    return this.client.get<T>(key);
  }

  async set(
    key: string,
    value: any,
    options?: { ex?: number; px?: number }
  ): Promise<"OK"> {
    if (options?.ex) {
      return this.client.set(key, value, { ex: options.ex });
    } else if (options?.px) {
      return this.client.set(key, value, { px: options.px });
    } else {
      return this.client.set(key, value);
    }
  }

  async setex(key: string, seconds: number, value: any): Promise<"OK"> {
    return this.client.setex(key, seconds, value);
  }

  async del(...keys: string[]): Promise<number> {
    return this.client.del(...keys);
  }

  async exists(...keys: string[]): Promise<number> {
    return this.client.exists(...keys);
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async decr(key: string): Promise<number> {
    return this.client.decr(key);
  }

  async keys(pattern?: string): Promise<string[]> {
    return this.client.keys(pattern || "*");
  }

  async flushall(): Promise<"OK"> {
    return this.client.flushall();
  }

  async hget<TData = string>(
    key: string,
    field: string
  ): Promise<TData | null> {
    return this.client.hget<TData>(key, field);
  }

  async hset<TData>(key: string, kv: Record<string, TData>): Promise<number> {
    return this.client.hset(key, kv);
  }

  async hdel(key: string, ...fields: string[]): Promise<0 | 1> {
    return this.client.hdel(key, ...fields);
  }

  async hgetall<TData extends Record<string, unknown>>(
    key: string
  ): Promise<TData | null> {
    return this.client.hgetall<TData>(key);
  }
}

// Use development KV if environment variables are not set
const isDevelopment =
  !process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN;

export const kv: KVStore = isDevelopment
  ? new DevKVStore()
  : new VercelKVStore(
      createClient({
        url: process.env.KV_REST_API_URL!,
        token: process.env.KV_REST_API_TOKEN!,
      })
    );
