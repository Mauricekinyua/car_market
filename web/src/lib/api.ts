export const API = process.env.NEXT_PUBLIC_API_URL!;

export async function api <T>(path: string, init?: RequestInit): Promise<T>{
    const res = await fetch (`${API}${path}`,{
        ...init,
        credentials: 'include',
        headers:{'Content-Type': 'application/json', ...init?.headers},
    });
    if(!res.ok) throw await res.json().catch(()=>({error: res.statusText}));
    return res.status === 204 ? (undefined as T): res.json();
}