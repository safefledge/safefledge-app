
import { InputProps } from "@/addons/interface/interfaces"

export default function Input({
    type,
    placeholder,
    onChange,
    className
} : InputProps){
    return <input className={className} type={type} placeholder={placeholder} onChange={onChange}/>
}