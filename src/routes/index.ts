import { Router } from "express";
import { readdirSync } from "fs";


const PATH_ROUTER = `${__dirname}/`;
const router = Router();

const cleanFileName = (fileName: string) => {   
    return fileName.split(".")[0];
}

console.log('PATH ROUTER: ', PATH_ROUTER)
readdirSync(PATH_ROUTER).filter((fileName) => {
    const cleanName = cleanFileName(fileName);
    if (cleanName !== "index") {
        import (`./${cleanName}`).then((module) => {
            router.use(`/${cleanName}`, module.router)
        })

        console.log(cleanFileName(fileName))
    }
}) 

export { router };