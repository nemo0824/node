const express = require('express')
const app = express()


app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

// req.body 사용시 필요한코드
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const { MongoClient } = require('mongodb')

let db
const url = 'mongodb+srv://nemo0824:Dlawodnjs09080%40@nemo0824.fqklg.mongodb.net/?retryWrites=true&w=majority&appName=nemo0824'
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')
  app.listen(8080, ()=>{
    console.log('http://localhost:8080 에서 서버 실행중')
})
}).catch((err)=>{
  console.log(err)
})




app.get('/', (req, res) =>{
    res.send('반갑다')
})

app.get('/news', (req, res)=>{
    // res.send('뉴스 왔다 !')
    db.collection('post').insertOne({title: "테스트 디비 인서트"})
})

app.get('/about', (요청, 응답) => {
    응답.sendFile(__dirname + '/index.html')
})

app.get('/list', async(req, res) => {
    let result = await db.collection('post').find().toArray()
    console.log(result)
    res.render('list.ejs', {posts : result})

})
app.get('/write', (요청, 응답) => {
    응답.render('write.ejs')
})

app.post('/newpost', (req, res)=>{
    console.log(req.body)
})


// Rest API 
// 1. uniform interface
// - 일관성있는 URL이 좋음
// - 하나의 URL + method 는 하나의 데이터를 보내야한다

// 2. clinet-server 구분
// -유저에 서버 역할을 맡기면안된다

// 3.Stateless
// -요청끼리 서로 의존성이 있으면안된다

// 4.cacheability
// - 요청은 캐싱이 가능해야함


// 좋은 URL 작명관습
// -동사보다는 명사로
// -띄어쓰기는 언더바_ 대신 대시 -
// -파일확장자는 쓰지말기
// -하위 문서를 뜻할땐 / 기호를 사용 

//commit