import https from 'https';
import { URL } from 'url';

export interface Candidate {
  id: string;
  type: 'candidates';
  attributes: {
    createdAt?: string; // date
    updatedAt?: string; // date
    email?: string;
    connected?: boolean;
    'consent-future-jobs-at'?: string; // date, read only
    'consent-given-future-jobs'?: boolean; // write only
    'facebook-id'?: string;
    'facebook-profile'?: string; // read only, html version
    'first-name'?: string;
    internal?: boolean;
    'last-name'?: string;
    'linkedin-profile'?: string; // read only, html version
    'linkedin-uid'?: string;
    'linkedin-url'?: string;
    merge?: boolean; // write only
    'original-resume'?: string; // read only, signed URL
    phone?: string;
    picture?: string;
    pitch?: string;
    'referring-site'?: string; // read only
    'referring-url'?: string;
    referred: boolean; // read only
    resume?: string;
    sourced?: boolean;
    'setConsent-expiration'?: boolean; // write only
    tags?: string[];
    unsubscribed?: boolean;
    'send-welcome-message'?: boolean; // create only
  };
}

export interface ListCandidatesParams {
  page?: number;
  perPage?: number;
  filter?: {
    createdAfter?: string;
    createdBefore?: string;
    updatedAfter?: string;
    updatedBefore?: string;
  }
}

/**
 * A simple client for the Teamtailor API.
 */
export class TeamtailorClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  /**
   * @param baseUrl  The base URL for your Teamtailor API (e.g. https://api.teamtailor.com/v1)
   * @param apiKey Your Teamtailor API key (must have Admin scope to read candidates)
   */
  constructor( baseUrl: string, apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * List candidates, with optional pagination or filters.
   */
  async listCandidates(params: ListCandidatesParams = {}): Promise<Candidate[]> {
    const url = new URL(`${this.baseUrl}/candidates`);

    this.addPaginationQueryParams(url, params);

    if (params?.filter?.createdAfter) {
      url.searchParams.append('filter[created-at][from]', params.filter.createdAfter);
    }

    if (params?.filter?.createdBefore) {
      url.searchParams.append('filter[created-at][to]', params.filter.createdBefore);
    }

    if (params?.filter?.updatedAfter) {
      url.searchParams.append('filter[updated-at][from]', params.filter.updatedAfter);
    }

    if (params?.filter?.updatedBefore) {
      url.searchParams.append('filter[updated-at][to]', params.filter.updatedBefore);
    }

    const body = await this.request<{ data: Candidate[] }>(url);
    return body.data;
  }

  /**
   * Get a single candidate by their ID.
   */
  async getCandidate(
    id: number,
  ): Promise<Candidate> {
    const url = new URL(`${this.baseUrl}/candidates/${id}`);

    const body = await this.request<{ data: Candidate }>(url);
    return body.data;
  }

  private addPaginationQueryParams(
    url: URL,
    params: ListCandidatesParams
  ): void {
    if (params.page) {
      url.searchParams.append('page', String(params.page));
    }
    if (params.perPage) {
      url.searchParams.append('per_page', String(params.perPage));
    }
  }

  private request<T>(url: URL): Promise<T> {
    const options: https.RequestOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Token token=${this.apiKey}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
        'X-Api-Version': '20240404',
      },
    };

    return new Promise((resolve, reject) => {
      const req = https.request(url, options, (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(raw) as T);
            } catch (err) {
              reject(new Error(`Invalid JSON: ${err}`));
            }
          } else {
            reject(
              new Error(`HTTP ${res.statusCode}: ${raw}`)
            );
          }
        });
      });

      req.on('error', reject);
      req.end();
    });
  }
}
