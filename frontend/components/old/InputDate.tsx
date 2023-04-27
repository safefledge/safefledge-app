

import { InputDateProps } from "@/interface/interfaces"

export default function InputDate({
    type,
    placeholder,
    onChange,
    className
} : InputDateProps){
    return <input className="bg-white border border-gray-300 rounded-lg w-input-width py-2 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" type={type} placeholder={placeholder} onChange={onChange}/>
}