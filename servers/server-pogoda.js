const express = require("express")
const app = express()
const path = require("path")
const port = 3000
const hbs = require("express-handlebars")

app.set('views', path.join(__dirname, 'views'));

app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.engine('hbs', hbs({
    extname: '.hbs',
    partialsDir: "views/partials-pogoda",
    defaultLayout: 'main.hbs',
    helpers: {
        shortTitle: function (title) {
            return title.substring(0, 10) + "...";
        },
    }
}));
app.set('view engine', 'hbs');


const context = require("./data/data-pogoda.json")
console.log(context)

app.get("/", function (req, res) {
    res.render('view-pogoda.hbs', context);
})

// app.use(express.static("static"))
app.listen(port, function () {

})