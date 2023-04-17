"use client";
import escapeRegExp from "@/utils/escapeRegExp";
import "./css/DropdownMenu.css";
import { useState, useEffect, useRef, MouseEvent } from "react";
import { FaGlobe, FaMapMarkerAlt, FaPlaneDeparture } from "react-icons/fa";

export default function Dropdown({
  isOpen,
  setIsOpen,
  type,
  setDepCity,
  setArrCity,
  disable,
  setPlaceholder,
  eventChange,
}: {
  isOpen: boolean;
  type: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDepCity: React.Dispatch<React.SetStateAction<string>>;
  setArrCity: React.Dispatch<React.SetStateAction<string>>;
  disable: React.Dispatch<React.SetStateAction<boolean>>;
  setPlaceholder: React.Dispatch<React.SetStateAction<string>>;
  eventChange: React.ChangeEvent<HTMLInputElement>;
}) {
  const [selected, setSelected] = useState("Select an option");
  const [options, setOptions] = useState([
    { label: "Suprise me!", icon: <FaGlobe /> },
  ]);
  const [isFocused, setIsFocused] = useState(false);
  const [hideOptions, setHideOptions] = useState(false);

  const [optionChosen, setOptionChosen] = useState<number | null>(null);

  const [dataOnRequest, setDataOnRequest] = useState([
    {
      label: "Warszawa (wszystkie lotniska)",
      icon: <FaMapMarkerAlt />,
      country: "Polska",
    },
    {
      label: "Warszawa Chopina (WAW)",
      icon: <FaPlaneDeparture />,
      country: "Polska",
    },
    { label: "Kraków", icon: <FaMapMarkerAlt />, country: "Polska" },
    { label: "Gdańsk", icon: <FaMapMarkerAlt />, country: "Polska" },
    { label: "Wrocław", icon: <FaMapMarkerAlt />, country: "Polska" },
    { label: "Poznań", icon: <FaMapMarkerAlt />, country: "Polska" },
    { label: "Katowice", icon: <FaMapMarkerAlt />, country: "Polska" },
    { label: "Szczecin", icon: <FaMapMarkerAlt />, country: "Polska" },
    { label: "Gdynia", icon: <FaMapMarkerAlt />, country: "Polska" },
    { label: "Nowy Jork", icon: <FaMapMarkerAlt />, country: "USA" },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  ///search logic

  //TODO: User stops typing for 1 second, then search is triggered
  //TODO: When user stops typing and delete his search, then show all options

  useEffect(() => {
    if (eventChange) {
      setSearch(eventChange.target.value);
      handleChange(eventChange);
    } else {
      return;
    }
  }, [eventChange]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === "") {
        setSearchResults([]);
        setIsOpen(false);
    }
    const matches = findMatches(e.target.value, dataOnRequest);
    if (matches.length === 0) {
      const matches = countryMatch(e.target.value, dataOnRequest);
      if (matches.length === 0) {
        setSearchResults([]);
        console.warn("No matches found")
      }
    }
    setHideOptions(true);
    setTimeout(() => {
      setHideOptions(false);
      setIsOpen(false);
    }, 10000);
  }

  function highlightMatchedLetters(str: string, searchValue: string) {
    const regex = new RegExp(searchValue, "gi");
    const matches = str.match(regex);
    if (!matches) {
      return str;
    }
    return str
      .split(regex)
      .map((part, index) =>
        matches[index] ? <b key={index}>{matches[index]}</b> : part
      );
  }

  function findMatches(wordToMatch: string, dataOnRequest: any) {
    const escapedWord = escapeRegExp(wordToMatch);
    const newData = dataOnRequest.filter(
      (place: { label: string; country: string }) => {
        const regex = new RegExp(escapedWord, "gi");
        return place.label.match(regex);
      }
    );
    setSearchResults(newData);
    return newData;
  }

  function countryMatch(wordToMatch: string, dataOnRequest: any) {
    const escapedWord = escapeRegExp(wordToMatch);
    const newData = dataOnRequest.filter(
      (place: { label: string; country: string }) => {
        const regex = new RegExp(escapedWord, "gi");
        return place.country.match(regex);
      }
    );
    setSearchResults(newData);
    return newData;
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // @ts-ignore
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    //@ts-ignore
    window.addEventListener("click", handleClickOutside);
    return () => {
      //@ts-ignore
      window.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    setIsOpen(isOpen);
  }, [isOpen]);

  function selectOption(
    option: { label: string; icon: JSX.Element },
    index: number
  ) {
    if (index === 0) {
      setOptionChosen(0);
      setDepCity(option.label);
      setIsOpen(false);
    } else if (index === 1) {
      setHideOptions(true);
      setOptionChosen(1);
      setPlaceholder(option.label);
      setTimeout(() => {
        setHideOptions(false);
        setOptionChosen(null);
        setPlaceholder("Country, city or airport");
      }, 10000);
    }
  }

  function manualSearch(
    option: { label: string; icon: JSX.Element },
    index: number,
    type: string
  ) {
    setDepCity(option.label);
    setIsOpen(false);
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
        <div
        className={`origin-top-right absolute top-full mt-2 w-dropdown rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${isOpen ? "dropdown-menu dropdown-scale" : "dropdown-menu dropdown-scale"}`}>
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="dropdown-menu"
          >
            {searchResults.map(
              (
                option: { label: string; icon: JSX.Element; country: string },
                index: number
              ) => {
                const label = option.label;
                const input = search.toLowerCase();
                const start = label.toLowerCase().indexOf(input);
                const end = start + input.length;

                return (
                  <button
                    key={index}
                    onClick={() => manualSearch(option, index, "dep")}
                    className="flex justify-start w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                  >
                    {option.icon && <span className="mr-2">{option.icon}</span>}
                    <div className="flex flex-col">
                      <span className="text-sm justify-start">
                        {label.slice(0, start)}
                        <span className="font-bold">
                          {label.slice(start, end)}
                        </span>
                        {label.slice(end)}
                      </span>
                      <span className="text-xs text-gray-400 justify-start">
                        {option.country}
                      </span>
                    </div>
                  </button>
                );
              }
            )}
            {searchResults.length === 0 && (
              <div className="flex flex-col ml-2">
                <span className="text-sm justify-start">No matches</span>
                <span className="text-xs text-gray-400 justify-start">
                  Try searching for a city or airport
                </span>
              </div>
            )}
          </div>
        </div>
      ) : isOpen && type === "arr" ? (
        <div
          className={`origin-top-right absolute top-full right-0 mt-2  w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-500 ease-out transform ${
            isOpen
              ? "opacity-100 visible scale-y-100"
              : "opacity-0 invisible scale-y-0"
          }`}
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="dropdown-menu"
          >
            {dataOnRequest.map((option, index) => (
              <div
                key={index}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
                onClick={() => selectOption(option, index)}
              >
                |{option.label}
              </div>
            ))}
          </div>
        </div>
      ) : isOpen && type === "dep" && optionChosen === 1 ? (
        <div
          className={`origin-top-right absolute top-full right-0 mt-2  w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-500 ease-out transform ${
            isOpen
              ? "opacity-100 visible scale-y-100"
              : "opacity-0 invisible scale-y-0"
          }`}
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="dropdown-menu"
          >
            {searchResults.map((option, index) => (
              <div
                key={index}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
                onClick={() => selectOption(option, index)}
              >
                |{option}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
