
interface userI {
    email: string
}
interface cardDataI {
    id: string,
    Title: string,
    isDir: false
    Description: string,
    Author: userI,
    filename: string,
    formatIconUrl: string,
    path: string,
    fileURL: string
}
interface directoryI{
    id: string,
    Description: string,
    isDir: true,
    Author: userI,
    parentDir: string,
    path: string,
    Title: string,
    children: directoryI[] | cardDataI[];
}



export type { userI, cardDataI,directoryI};