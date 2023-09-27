declare const PATH: string;
declare function get(filePath?: string, preserveFormatting?: boolean): (string | [string, string])[];
declare function set(ip: string, host: string | string[]): Promise<unknown>;

export { PATH, get, set };
