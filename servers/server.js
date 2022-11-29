const express = require("express")
const app = express()
const path = require("path")
const port = 3000
const hbs = require("express-handlebars")

app.set('views', path.join(__dirname, 'views'));

// app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
// app.engine('hbs', hbs({
//     defaultLayout: 'main.hbs',
//     helpers: {
//         shortTitle: function (title) {
//             return title.substring(0, 10) + "...";
//         },
//         bigFirstLetter: function (title) {
//             let titleT = title.split(" ")
//             for (let i = 0; i < titleT.length; i++) {
//                 titleT[i] = titleT[i].charAt(0).toUpperCase() + titleT[i].slice(1)
//             }
//             return titleT.join(" ")
//         },
//         myslniki: function (title) {
//             let letters = title.split("")
//             console.log(letters);
//             for (let i = 0; i < letters.length; i++) {
//                 if (letters[i + 1] !== " " && letters[i] !== " " && i !== letters.length - 1) {
//                     letters[i] = letters[i] + "-"
//                 }
//             }
//             return letters.join("")
//         },

//     }
// }));
app.engine('hbs', hbs({
    extname: '.hbs',
    partialsDir: "views/view4",
}));

app.set('view engine', 'hbs');


const context = require("./data/data4.json")
console.log(context)

app.get("/", function (req, res) {
    res.render('view4.hbs', context);
})

// app.get("/form", function (req, res) {
//     context.title = req.query.text
//     res.render('view3.hbs', context);
// })

// app.use(express.static("static"))
app.listen(port, function () {

})