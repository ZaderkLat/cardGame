export interface gameModeDTO {
    game_mode_id: number;
    title: string;
    value: string;
    image: string;
}
export interface gameModeTypeDTO {
    game_mode_type_id: number;
    label: string;
    value: string
    data_type: string
}


export interface gameModeResponse {
    game_mode_id: number;
    title_es: string;
    title_en: string;
    value: string;
    image: {
        path: string;
    };
}
export interface gameModeTypeResponse {
    game_mode_type_id: number;
    parameter: {
        data_type: string;
        label_en: string;
        label_es: string
        value: string;
    }
}


export interface RecordTableProperty {
    [key: string]: string;
}

export interface RecordTableRow {
    record_id: number;
    rounds: number;
    created_at: string;
    properties: RecordTableProperty;
}

export interface RecordTableColumn {
    key: string;
    label: string;
}

export interface RecordTableResponse {
    records: RecordTableRow[];
    columns: RecordTableColumn[];
}




