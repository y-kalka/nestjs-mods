import { BlacklistItem } from './blacklist-item.interface';

export interface BlacklistStore {
  get(token: string): Promise<BlacklistItem>;
  getAll?(): Promise<BlacklistItem[]>;
  set(token: string, data: BlacklistItem): Promise<void>;
  delete(token: string): Promise<void>;
}
