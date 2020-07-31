var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    Campground = require("./models/campground"),//记得改回逗号
    Comment = require("./models/comment"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    seedDB = require("./seeds");
    // seedDB();

    //requiring routes
var commentRoutes = require("./routes/comments");
    campgroundRoutes = require("./routes/campgrounds");
    indexRoutes = require("./routes/index");

mongoose.connect('mongodb+srv://mingxixu:xmx123123@cluster0.ra1ir.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(require('express-session')({
  secret:"Once again",
  resave:false,
  saveUninitialized:false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.locals.moment = require('moment');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.set("view engine","ejs");
app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
app.use(methodOverride("_method"));
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);



app.listen(process.env.PORT || 3000,function(){
  console.log("the YelpCamp Server has started!!");
});