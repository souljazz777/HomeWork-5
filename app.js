var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
var mongoose = require('mongoose');

// 程式出現重大錯誤時
process.on('uncaughtException', (err)=>{
  // 紀錄錯誤下來，等到服務都處理完後，停掉該process
  console.error('Uncaughted Exception')
  console.error(err)
  process.exit(1)
})

dotenv.config({path:'./config.env'})
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
)

mongoose.connect(DB)
  .then(()=>{
    console.log('資料庫連接成功')
  })
  .catch((error)=>{
    console.log('error')
  })

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postRouter = require('./routes/post')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postRouter)


app.use((req,res)=>{
  res.status(404).send('錯誤頁面')
})

//express錯誤處理
//自己設定的err錯誤
const resErrorProd = (err,res)=>{
  if(err.isOperational){
    res.status(err.statusCode).json({
      message: err.message
    })
  }else{
    // log紀錄
    console.error('出現重大錯誤',err)
    //出現罐頭預設訊息
    res.status(500).json({
      status: 'error',
      message: '系統錯誤，請洽系統管理員'
    })
  }
}

// 開發環境錯誤
const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack
  })
}

// 錯誤處理
app.use(function(err,req,res,next){
  // dev
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "dev"){
    return resErrorDev(err, res)
  }
  // production
  if(err.name === 'ValidationError'){
    err.message = '資料庫欄位未填寫正確，請重新輸入'
    err.isOperational = true;
    return resErrorProd(err, res)
  }
  resErrorProd(err, res)
})

// 未捕捉到的catch
process.on('unhandleRejection', (err, promise)=>{
  console.error('未捕捉到的rejection', promise, '原因', err)
})


module.exports = app;
