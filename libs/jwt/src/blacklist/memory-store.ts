import { Injectable } from '@nestjs/common';
import { BlacklistItem } from './blacklist-item.interface';
import { BlacklistStore } from './blacklist-store.interface';

@Injectable()
export class MemoryStore implements BlacklistStore {

  private store = new Map<string, BlacklistItem>();

  public async set(token: string, data: BlacklistItem) {
    this.store.set(token, data);
  }

  public async get(token: string) {
    return this.store.get(token);
  }

  public async delete(token: string) {
    this.store.delete(token);
  }

  public async getAll() {
    return Array.from(this.store.values());
  }
}
