"use client"
import { useState, useEffect, useRef, MouseEvent } from "react"
import { FaGlobe, FaMapMarkerAlt, FaPlaneDeparture } from 'react-icons/fa';

export default function Dropdown({
    isOpen,
    setIsOpen,
    type,
    setDepCity,
    setArrCity,
    disable,
    setPlaceholder,
    eventChange
} : {
    isOpen: boolean
    type: string
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    setDepCity: React.Dispatch<React.SetStateAction<string>>
    setArrCity: React.Dispatch<React.SetStateAction<string>>
    disable: React.Dispatch<React.SetStateAction<boolean>>
    setPlaceholder: React.Dispatch<React.SetStateAction<string>>
    eventChange: React.ChangeEvent<HTMLInputElement>
}){
    const [selected, setSelected] = useState("Select an option")
    const [options, setOptions] = useState([
        { label: 'Suprise me!', icon: <FaGlobe /> },
    ])
    const [isFocused, setIsFocused] = useState(false)
    const [hideOptions, setHideOptions] = useState(false)

    const [optionChosen, setOptionChosen] = useState<number | null>(null)

    const [dataOnRequest, setDataOnRequest] = useState([
        {label: "Warszawa (wszystkie lotniska)", icon: <FaMapMarkerAlt />, country: "Polska"},
        {label: "Warszawa Chopina (WAW)", icon: <FaPlaneDeparture />, country: "Polska"},
        {label: "Kraków", icon: <FaMapMarkerAlt />, country: "Polska"},
        {label: "Gdańsk", icon: <FaMapMarkerAlt />, country: "Polska"},
        {label: "Wrocław", icon: <FaMapMarkerAlt />, country: "Polska"},
        {label: "Poznań", icon: <FaMapMarkerAlt />, country: "Polska"},
        {label: "Katowice", icon: <FaMapMarkerAlt />, country: "Polska"},
        {label: "Szczecin", icon: <FaMapMarkerAlt />, country: "Polska"},
        {label: "Gdynia", icon: <FaMapMarkerAlt />, country: "Polska"},
        {label: "Nowy Jork", icon: <FaMapMarkerAlt />, country: "USA"},
    ])

    const dropdownRef = useRef<HTMLDivElement>(null);

    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])

    ///search logic


    //TODO: User stops typing for 1 second, then search is triggered
    //TODO: When user stops typing and delete his search, then show all options
    
    useEffect(() => {
        if(eventChange){
            handleChange(eventChange)
        } else {
            return;
        }
    }, [eventChange])

    function handleChange(e: React.ChangeEvent<HTMLInputElement>){
        const matches = findMatches(e.target.value, dataOnRequest)
        if(matches.length === 0){
            const countryMatches = countryMatch(e.target.value, dataOnRequest)
            if(countryMatches.length === 0){
               console.warn("No matches")
            } 
        }
        setHideOptions(true)
        setTimeout(() => {
            setHideOptions(false)
            setSearchResults([])
        }, 10000)
    }

    function findMatches(wordToMatch: string, dataOnRequest: any){
        const newData = dataOnRequest.filter((place: {label: string, country: string}) => {
            const regex = new RegExp(wordToMatch, 'gi')
            return place.label.match(regex)
        })
        setSearchResults(newData)
        return newData
    }

    function countryMatch(wordToMatch: string, dataOnRequest: any){
        const newData = dataOnRequest.filter((place: {label: string, country: string}) => {
            const regex = new RegExp(wordToMatch, 'gi')
            return place.country.match(regex)
        })
        setSearchResults(newData)
        return newData
    }

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


    function selectOption(option: {label: string, icon: JSX.Element}, index: number){
        if(index === 0){
            setOptionChosen(0)
            setDepCity(option.label)
            setIsOpen(false)
        } else if(index === 1){
            setHideOptions(true)
            setOptionChosen(1)
            setPlaceholder(option.label)
            setTimeout(() => {
                setHideOptions(false)
                setOptionChosen(null)
                setPlaceholder("Country, city or airport")
            }, 10000)
        }
    }


    function manualSearch(option: {label: string, icon: JSX.Element}, index: number, type: string){
        setDepCity(option.label)
        setIsOpen(false)

    }

    /*
    {options.map((option, index) => (
                    <div key={index} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => select(option)}>|
                        {option}
                    </div>
                ))}
                */

    return (
       <>
       {isOpen && type === "dep" ? (
              <div className={`origin-top-right absolute top-full mt-2  w-dropdown rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-500 ease-out transform ${isOpen ? 'opacity-100 visible scale-y-100' : 'opacity-0 invisible scale-y-0'}`}>
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-menu">
                { hideOptions === false &&
                    options.map((option, index) => (
                            <button key={index} onClick={() => selectOption(option, index)} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">
                            {option.icon && <span className="mr-2">{option.icon}</span>}
                            {option.label}
                          </button>
                    ))}
                {searchResults.map((option: {label: string, icon: JSX.Element, country: string}, index: number) => (
                        <button key={index} onClick={() => manualSearch(option, index, "dep")} className="flex justify-start w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">
                        {option.icon && <span className="mr-2">{option.icon}</span>}
                        <div className="flex flex-col">
                        {option.label}
                        <span className="text-xs text-gray-400 justify-start">{option.country}</span>
                        </div>
                        </button>
                        ))}
                    
                    
              </div>
            </div>
       ) : 
         isOpen && type === "arr" ? (
            <div className={`origin-top-right absolute top-full right-0 mt-2  w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-500 ease-out transform ${isOpen ? 'opacity-100 visible scale-y-100' : 'opacity-0 invisible scale-y-0'}`}>
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-menu">
                {dataOnRequest.map((option, index) => (
                    <div key={index} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => selectOption(option, index)}>|
                    {option.label}
                </div>
                ))}
              </div>
            </div>
         ) : isOpen && type === "dep" && optionChosen === 1 ? 
         <div className={`origin-top-right absolute top-full right-0 mt-2  w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-500 ease-out transform ${isOpen ? 'opacity-100 visible scale-y-100' : 'opacity-0 invisible scale-y-0'}`}>
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-menu">
                {searchResults.map((option, index) => (
                    <div key={index} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => selectOption(option, index)}>|
                    {option}
                </div>
                ))}
              </div>
            </div>
         : null
       }
       </>
    )


}