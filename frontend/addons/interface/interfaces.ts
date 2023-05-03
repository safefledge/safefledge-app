

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


export interface IUserProps{
    email: string;
    avatar: string;
    fullname: string;
    flights: IFlightProps[];
    travelRecommendations: ITravelRecommendationProps[];
}

interface IFlightProps {
    id: number;
    flightNumber: string;
    airline: string;
    departureDate: string;
    departureTime: string;
    departureAirport: string;
    arrivalAirport: string;
    flightType: string;
    price: number;
    currency: string;
    status: string;
    bookingReference: string;
}

export interface ITravelRecommendationProps {
    departureAirport: string;
    arrivalAirport: string;
    subtitle: string;
    price: number;
    currency: string;
    flightType: string;
    travelClass: string;
}