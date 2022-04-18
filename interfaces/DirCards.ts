
interface userI {
    email: string
}
interface cardDataI {
    id: string,
    Title: string,
    isDir: false,
    Description: string,
    Author: userI,
    filename: string,
    formatIconUrl: string,
    path: string,
    hrefURL: string,
    fileURL: string
}
interface directoryI{
    id: string,
    Description: string,
    isDir: true,
    Author: userI,
    parentDir: string,
    path: string,
    hrefURL: string,
    Title: string,
    children: directoryI[] | cardDataI[];
}

interface authorI{
    email: string,
    id: string
}

interface fileI{
    id: string,
    name: string,
    description: string,
    author: string,
    onedriveURL: string,
}

interface breadcrumbItemI{
    id: string,
    name: string
}

interface v2directoryI {
    id: string,
    name: string,
    description: string,
    author: authorI,
    breadcrumb: breadcrumbItemI[],
    fileChilds: string[],
    dirChilds: string[]
}


export type { userI, cardDataI,directoryI,v2directoryI};