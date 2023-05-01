"use client";
import { useTranslations } from 'next-intl';
import Image from 'next/image';


function GoogleSignInButton() {
    const auth_translations = useTranslations("Auth");
  return (
    <button className="w-[376px] h-[38px] bg-[#FFFFF] rounded-[10px] text-[#92929D] text-[16px] border-[1px] border-solid border-[#2F80ED] mt-[6px] font-normal flex items-center justify-center gap-2">
      <Image src="/images/google.svg" alt="Google" width={20} height={20} />
      {auth_translations("Continue with Google")}
    </button>
  );
}

export default GoogleSignInButton;