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
