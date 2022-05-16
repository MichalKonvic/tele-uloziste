
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
    _id: string
}

interface fileI{
    _id: string,
    name: string,
    description: string,
    author: string,
    onedriveURL: string,
}

interface breadcrumbI{
    _id: string,
    name: string
}

interface displayDataI{
    breadcrumb: breadcrumbI[],
    dirs: v2directoryI[],
    files: fileI[]
}

interface folderI{
    _id: string,
    name: string,
    description: string,
    author: authorI
}

interface v2directoryI {
    _id: string,
    name: string,
    description: string,
    author: authorI,
    bradcrumb: breadcrumbI[],
    fileChilds: string[],
    dirChilds: string[]
}


export type { userI, cardDataI,directoryI,v2directoryI,breadcrumbI,displayDataI,folderI, fileI};