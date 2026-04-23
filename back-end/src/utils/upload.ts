import multer from 'multer'

//配置内存存储,直接读取文件buffer,不用存本地磁盘
export const upload = multer({
    storage:multer.memoryStorage(),
    //文件大小限制 5MB
    limits:{fileSize:5 * 1024 * 1024}
})