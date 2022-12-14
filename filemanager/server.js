const express = require("express")
const app = express()
const path = require("path")
const port = 3000
const hbs = require("express-handlebars")
const formidable = require('formidable');
const bodyParser = require("body-parser")

let context = {
    item: [],
    id: 1
}

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
    extname: '.hbs',
    partialsDir: "views/partials",
    defaultLayout: 'main.hbs',
    helpers: {
        file: function (type) {
            if (type.includes("image")) {
                return "image" + '/' + type.split("/")[1]
            } else if (type.includes("doc")) {
                return "doc"
            } else if (type.includes("pdf")) {
                return "pdf"
            } else if (type.includes("txt")) {
                return "txt"
            } else {
                return "document"
            }
        }
    }
}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.render("upload.hbs");
})

app.use(express.static("static"));

app.get("/filemanager", function (req, res) {
    res.render("filemanager.hbs", context)
})

app.get("/upload", function (req, res) {
    res.redirect("/");
})

app.post('/filemanager', function (req, res) {

    let form = formidable({});
    form.keepExtensions = true
    form.multiples = true

    form.uploadDir = __dirname + '/static/upload/'

    form.parse(req, function (err, fields, files) {
        console.log(files);

        id = context.id

        if (typeof (files.file) === 'object' && files.file.length === undefined) {
            let item = {
                id: id,
                name: files.file.name,
                path: files.file.path,
                size: files.file.size,
                type: files.file.type,
                date: files.file.lastModifiedDate
            }
            id++
            context.id = id
            context.item.push(item)
        } else {
            files.file.forEach(element => {
                let item = {
                    id: id,
                    name: element.name,
                    path: element.path,
                    size: element.size,
                    type: element.type,
                    date: element.lastModifiedDate
                };
                id++
                context.id = id
                context.item.push(item)
            })
        }


        console.log(context);

        res.render("filemanager.hbs", context)
    });
});

app.get("/info", function (req, res) {
    let id = req.query.id
    let item = context.item.find(item => item.id == id)
    res.render("info.hbs", item)
})

app.get("/show", function (req, res) {
    let id = req.query.id
    let item = context.item.find(item => item.id == id)
    res.sendFile(item.path)
})

app.get("/delete/:id", function (req, res) {
    let id = req.params.id
    let item = context.item.find(item => item.id == id)
    let index = context.item.indexOf(item)
    context.item = context.item.slice(0, index).concat(context.item.slice(index + 1))
    res.redirect("/filemanager")
})

app.get("/reset", function (req, res) {
    context.item = []
    context.id = 1
    res.redirect("/filemanager")
})

app.get("/download/:id", function (req, res) {
    let id = req.params.id
    let item = context.item.find(item => item.id == id)
    res.download(item.path, item.name)
})

app.listen(port, function () {
    console.log("Server is running on port " + port);
})