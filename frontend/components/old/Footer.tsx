import Image from "next/image";



export default function Footer(){
    return (
        <div className="bg-primary w-footer-width h-footer-height flex flex-col">
            <div className="flex flex-row gap-16">
                <div className="flex flex-col w-footer-logo">
                    <Image className="-ml-4 relative z-10" src="/images/logo.png" width={283} height={283} alt="logo" />
                    <p className="text-white tracking-tighter text-sm w-auto ml-8 relative bottom-20">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel tincidunt luctus, nunc nisl aliquet nisl, nec lacinia nunc dolor nec nisl. Sed euismod, nisl vel tincidunt luctus, nunc nisl aliquet nisl, nec lacinia nunc dolor nec nisl.</p>
                </div>
                <div className="flex flex-col w-footer-links my-auto">
                    <h1 className="text-white text-2xl font-bold">Links</h1>
                </div>
                

            </div>
        </div>
    )
}