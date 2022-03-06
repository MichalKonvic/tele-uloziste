import React from 'react'
import { useRouter } from 'next/router'

const filePage: React.FC = () => {
    const router = useRouter();
    const filePath = router.query.filePath || []
    return <p>{filePath[filePath.length - 1]}</p>
}

export default filePage;