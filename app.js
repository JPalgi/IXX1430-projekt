let bodyParser  = require("body-parser"),
    express     = require("express"),
    flash       = require("express-flash-notification"),
    session     = require("express-session"),
    database    = require("./middleware/database"),
    auth        = require("./middleware/basicAuth"),
    morgan      = require("morgan"),
    requestIp   = require("request-ip"),
    helmet	= require("helmet"),
    app         = express();

//This line add the authentication requirement to all pages starting with localhost:3000/
//app.all("/*", auth);

//app.use(morgan('tiny'));
app.use(requestIp.mw());
app.use(helmet());

// ============ ROUTES ============

let ostmineRoutes = require("./routes/ostmine"),
    regularCardRead   = require("./routes/regularCardRead"),
    adminRoutes   = require("./routes/admin");

// ============ APP USE ============

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.disable("view cache");

app.use(session({
    secret: 'Kapilukk on väga salajane!',
    resave: false,
    saveUninitialized: false
}));

// ============ FLASH ============

const flashNotificationOptions = {
    beforeSingleRender: function(item, callback) {
        if (item.type) {
            switch(item.type) {
                case 'SUCCESS':
                    item.type = 'Edukas ost!';
                    item.alertClass = 'alert-success';
                    break;
                case 'SUCCESS2':
                    item.type = 'Registreerimine õnnestus!';
                    item.alertClass = 'alert-success';
                    break;
                case 'WARN':
                    item.type = 'Tähelepanu!';
                    item.alertClass = 'alert-warning';
                    break;
                case 'ERROR':
                    item.type = 'Tekkis viga';
                    item.alertClass = 'alert-danger';
                    break;
            }
        }
        callback(null, item);
    }
};

// Flash Notification Middleware Initialization
app.use(flash(app, flashNotificationOptions));

// ============ SERVER LISTENING TO ROUTES ============

app.use("/tooted/:id", ostmineRoutes);
app.use(regularCardRead);
app.use("/admin", adminRoutes);

let server = app.listen(3000, function(){
    console.log("Server is listening to port 3000! (ip:3000)");
});

// ============ ERRORS ============

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

