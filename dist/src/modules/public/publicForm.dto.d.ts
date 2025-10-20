declare class SourceDTO {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
}
export declare class PublicFormDTO {
    name: string;
    phone: string;
    email?: string;
    workType?: string;
    message?: string;
    consent: boolean;
    address?: string;
    contactTime?: string;
    source?: SourceDTO;
    files?: string[];
    locale?: string;
}
export {};
