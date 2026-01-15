export class AIServices {
  constructor() {}

  async warmUpCache(): Promise<void> {
    // no-op stub for dev environment
    return;
  }

  async search(query: string, _opts?: any): Promise<any[]> {
    // return empty results in stub
    return [];
  }

  async getRecommendations(_productId: string | number, _limit = 5): Promise<any[]> {
    return [];
  }

  getCacheStats() {
    return { hits: 0, misses: 0 };
  }

  clearCache() {
    // no-op
  }
}
