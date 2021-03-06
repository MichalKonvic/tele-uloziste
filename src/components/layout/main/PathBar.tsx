import Link from 'next/link'
import React, { useRef, useState } from 'react'
import { directoryI, breadcrumbI } from '../../../../interfaces/DirCards'

const RouteItem = ({ breadcrumbData }: { breadcrumbData: breadcrumbI }) => {
    return (
        <Link href={"/explorer/" + breadcrumbData._id} replace passHref>
            <div className='items-center content-center justify-center flex gap-2' key={breadcrumbData._id}>
                <p className='text-blue-400 underline truncate w-16 text-right cursor-pointer hover:text-blue-500'>{breadcrumbData.name}</p>
                <div className='-mb-2'>
                    <MiniFolderIcon />
                </div>
                <p>/</p>
            </div>
        </Link>
    )
}


const RouteItemLast = ({ breadcrumbData }: { breadcrumbData: breadcrumbI }) => {
    return (
        <div className='items-center content-center justify-center flex gap-2' key={breadcrumbData._id}>
            <p className='text-gray-500 truncate w-24'>{breadcrumbData.name}</p>
        </div>
    )
}

const PathBar = (
    { breadcrumbArray }:
        { breadcrumbArray: breadcrumbI[] }
) => {
    ''
    const [menu, toggleMenu] = useState(false);
    const menuRef = useRef(null);

    const RoutesMapper = () => {
        // mobile displays check
        if (breadcrumbArray.length > 3) {
            return (
                <>
                    <button key="breadcrumbButton" onClick={() => toggleMenu(!menu)}>
                        <MenuIcon />
                    </button>
                    <p>/</p>
                    <RouteItemLast key="breadcrumbLastItem" breadcrumbData={breadcrumbArray[breadcrumbArray.length - 1]} />
                    {menu && <>
                        <div className='w-screen h-screen absolute -top-14 left-0' onClick={(event) => {
                            if (menuRef.current && !menuRef.current.contains(event.target)) toggleMenu(!menu)
                        }}></div>
                        <div ref={menuRef} className='absolute bg-gray-200 rounded-lg left-5 z-20 top-12 flex flex-col overflow-hidden'>
                            {breadcrumbArray.map((breadcrumb) => {
                                if (breadcrumbArray[breadcrumbArray.length - 1] == breadcrumb) return null;
                                return (
                                    <Link key={breadcrumb._id} passHref href={"/explorer/" + breadcrumb._id} replace>
                                        <div className="w-32 px-5 h-10 py-1 flexCenter duration-200 hover:bg-gray-300 select-none cursor-pointer">
                                            <p className='truncate w-20 text-center'>{breadcrumb}</p>
                                        </div>
                                    </Link>
                                )
                            })
                            }
                        </div>
                    </>
                    }
                </>
            )
        }
        return <>
            {(breadcrumbArray.map((breadcrumb) => {
                // LAST ITEM SELECT
                if (breadcrumbArray[breadcrumbArray.length - 1]._id == breadcrumb._id) return (
                    <RouteItemLast key={breadcrumb._id} breadcrumbData={breadcrumb} />
                );
                return (
                    <RouteItem key={breadcrumb._id} breadcrumbData={breadcrumb} />
                )
            }))}
        </>
    }

    return (
        <div
            className='w-screen h-16 bg-gray-100 flex justify-between items-center absolute top-14'
        >
            <div key="breadcrumbContainer" className='w-screen overflow-clip flex h-12 gap-2 items-center mx-2'>
                <RoutesMapper key="breadcrumbRoutes" />
            </div>
        </div>
    )
}


const MenuIcon = () => {
    return (
        <div className='flexCenter select-none rounded-full border-2 h-6 w-6 cursor-pointer hover:bg-gray-200 duration-200'>
            ...
        </div>
    )
}

const MiniFolderIcon = () => {
    return (
        <svg className='w-5 h-5' width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" width="11" height="12" rx="1" fill="#6C2CF2" />
            <g filter="url(#filter0_d_6_91)">
                <rect x="1" y="3" width="15" height="10" rx="1" fill="#9F76F7" />
            </g>
            <defs>
                <filter id="filter0_d_6_91" x="0" y="3" width="17" height="13" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feMorphology radius="1" operator="erode" in="SourceAlpha" result="effect1_dropShadow_6_91" />
                    <feOffset dy="2" />
                    <feGaussianBlur stdDeviation="1" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6_91" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6_91" result="shape" />
                </filter>
            </defs>
        </svg>
    )
}

export default PathBar