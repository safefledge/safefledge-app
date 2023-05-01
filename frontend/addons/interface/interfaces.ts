

export interface InputProps {
    type: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className: string;
}


export interface InputDateProps {
    type: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
    onClick: (e: React.MouseEvent<HTMLInputElement>) => void;
    className: string;
}


export type ValidationSchemaInterface = {
    email: string;
    password: string;
    fullname: string;
}

export type ValidationSchemaLogin = {
    email: string;
    password: string;
}


export interface MultiCityUserProps {
    id: number;
    name: string;
}

