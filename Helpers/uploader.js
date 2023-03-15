const multer = require('multer')
const path = require('path')

const multerUpload =  multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/media')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: multerUpload }); 

module.exports = upload;