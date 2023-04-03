"use client"
import { useState, useEffect, useRef, MouseEvent } from "react"

export default function Dropdown({
    isOpen,
    setIsOpen,
    type,
    setDepCity,
    setArrCity
} : {
    isOpen: boolean
    type: string
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    setDepCity: React.Dispatch<React.SetStateAction<string>>
    setArrCity: React.Dispatch<React.SetStateAction<string>>
}){
    const [selected, setSelected] = useState("Select an option")
    const [options, setOptions] = useState(["Option 1", "Option 2", "Option 3"])

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // @ts-ignore
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
          }
        }
    
        //@ts-ignore
        window.addEventListener('click', handleClickOutside);
    
        return () => {
            //@ts-ignore
          window.removeEventListener('click', handleClickOutside);
        };
      }, [dropdownRef]);

    useEffect(() => {
        setIsOpen(isOpen)
    }, [isOpen])

    function toggle(){
        setIsOpen(!isOpen)
    }

    function select(option: string){
        if(type === "dep"){
            setDepCity(option)
        } else {
            setArrCity(option)
        }
        setIsOpen(false)
    }

    return (
       <>
       {isOpen ? (
              <div className={`origin-top-right absolute top-full right-0 mt-2  w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-500 ease-out transform ${isOpen ? 'opacity-100 visible scale-y-100' : 'opacity-0 invisible scale-y-0'}`}>
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-menu">
                {options.map((option, index) => (
                    <div key={index} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => select(option)}>|
                        {option}
                    </div>
                ))}
              </div>
            </div>
       ) : 
        null
       }
       </>
    )


}