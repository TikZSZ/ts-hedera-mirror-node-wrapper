import { BaseMirrorClient, Params } from "./";

class FetchClient implements BaseMirrorClient {
  constructor(public baseURL: string) {
    if (this.baseURL.endsWith('/')) {
      this.baseURL = this.baseURL.slice(0, -1);
    }
  }

  public async fetch<D = any>(url: string, params: Params): Promise<D> {
    if (!this.baseURL) throw new Error('no url set');

    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    const fullURL = `${this.baseURL}${url}${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(fullURL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as D;
  }
}

export { FetchClient as Client };