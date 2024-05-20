const multer = require('multer')
const fs = require('fs')   //file-system
const path = require('path') //file path

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dest = 'public/uploads'
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true })
        }
        cb(null, dest)
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    }
})

const upload = multer({ storage: storage })

module.exports = upload