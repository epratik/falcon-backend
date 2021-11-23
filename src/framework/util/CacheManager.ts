import memcache from 'memory-cache'
import { ICacheManager } from '../../core/interfaces/framework/ICacheManager';

export class CacheManager implements ICacheManager{

    constructor(){
      
    }

    get(key: string) {
        return memcache.get(key);
    }

    put<T>(key: string, value: T, duration: number): void {
        memcache.put(key, value, duration * 1000);
    }

    clear() {
        memcache.clear();
    }
}