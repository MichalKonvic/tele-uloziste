import React, { useState } from 'react'
import { directoryI } from '../../../../interfaces/DirCards'

const RouteItem = ({ RouteName }: { RouteName: string }) => {
    // TODO add link functionality to that
    return (
        <div className='items-center content-center justify-center flex gap-2' key={RouteName}>
            <p className='text-blue-400 underline truncate w-16 text-right cursor-pointer hover:text-blue-500'>{RouteName}</p>
            <div className='-mb-2'>
                <MiniFolderIcon />
            </div>
            <p>/</p>
        </div>
    )
}


const RouteItemLast = ({ RouteName }: { RouteName: string }) => {
    return (
        <div className='items-center content-center justify-center flex gap-2' key={RouteName}>
            <p className='text-gray-500'>{RouteName}</p>
        </div>
    )
}

const PathBar = (
    { directoryData }:
        { directoryData: directoryI }
) => {
    const pathArr = directoryData.path.split("/");
    const [menu, toggleMenu] = useState(false);

    const RoutesMapper = () => {
        // mobile displays check
        if (pathArr.length > 3) {
            return (
                <>
                    <button onClick={() => toggleMenu(!menu)}>
                        <MenuIcon />
                    </button>
                    <p>/</p>
                    <RouteItemLast RouteName={pathArr[pathArr.length - 1]} />
                    {menu && <div className='absolute bg-gray-200 rounded-lg left-5 z-20 top-12 flex flex-col overflow-hidden'>
                        {pathArr.map((routeU) => {
                            if (pathArr[pathArr.length - 1] == routeU) return null;
                            // TODO add links functionality
                            return (
                                <div key={routeU} className="w-40 truncate h-10 px-2 py-1 flexCenter duration-200 hover:bg-gray-300 select-none cursor-pointer">
                                    {routeU}
                                </div>
                            )
                        })
                        }
                    </div>}
                </>
            )
        }
        return (pathArr.map((routeU) => {
            // LAST ITEM SELECT
            if (pathArr[pathArr.length - 1] == routeU) return (
                <RouteItemLast RouteName={routeU} />
            );
            return (
                <RouteItem RouteName={routeU} />
            )
        }))
    }

    return (
        <div
            className='w-screen h-16 bg-gray-100 flex justify-between items-center absolute top-14'
        >
            <div className='w-screen overflow-clip flex h-12 gap-2 items-center mx-2'>
                <RoutesMapper />
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
                <filter id="filter0_d_6_91" x="0" y="3" width="17" height="13" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
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