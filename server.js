const { render } = require('ejs')
const express = require('express')
const app = express()
const methodOverride = require('method-override')
const { MongoClient, ObjectId } = require('mongodb')

app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
// req.body 사용시 필요한코드
app.use(express.json())
app.use(express.urlencoded({extended:true}))



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
    res.send('뉴스 왔다 !')
    // db.collection('post').insertOne({title: "테스트 디비 인서트"})
})

app.get('/about', (요청, 응답) => {
    응답.sendFile(__dirname + '/index.html')
})

app.get('/list', async(req, res) => {
    let result = await db.collection('post').find().toArray()
    // console.log(result)
    res.render('list.ejs', {posts : result})

})
app.get('/write', (요청, 응답) => {
    응답.render('write.ejs')
})

// 1.글작성 페이지에서 글써서 서버로 전송 
// 2.서버는 글 검사 
// 3.글을 db에 저장
app.post('/add', async(req, res)=>{
    try{
        if(req.body.title == ''){
            res.send("글 입력해라")
        }else{
            console.log(req.body)
            await db.collection('post').insertOne({title: req.body.title, content: req.body.content})
            res.redirect("/list")
        }
    }catch(e){
        // console.log(e)
        res.status(500).send('서버에러남')
    }
  
    
})

// 게시글  조회
app.get('/detail/:id', async(req, res)=>{
    try{
        let result = await db.collection('post').findOne({_id: new ObjectId(req.params.id)})
        // console.log(req.params.id)
        res.render('detail.ejs', {result: result})
       //  res.render('detail.ejs', {posts: result})
    }catch(e){
        res.status(400).send("잘못된 url 입력")
    }

})

// 게시글 수정
// detail/:id 에서 수정 버튼 생성
// 수정버튼으로 게시글 수정 edit.ejs:id 로 이동 
// 수정할때 이미 input에 이전 내용이 있어야함 
// 따라서 조회를 똑같이하고 edit.ejs에 값을 보내줌
// input value에 값을 넣어준다 


app.get('/edit/:id', async(req, res)=>{
    // 조회하는기능 
    let result = await db.collection('post').findOne({_id: new ObjectId(req.params.id)})
    // console.log(result)
    // edit.ejs 에 result값을 넘겨줌
    res.render('edit.ejs', {result: result})
//    console.log(result)
})

app.put('/edit', async(req, res)=>{
    let result = await db.collection('post').updateOne({_id: new ObjectId(req.body.id)}, {$set: {title: req.body.title, content: req.body.content}})
    // console.log(req.body)
    console.log(req.params.id)
    res.redirect('/list')
})

app.delete('/delete', async(req, res)=>{
   console.log(req.query)
   
   await db.collection('post').deleteOne({_id: new ObjectId(req.query.docid)})
   res.redirect("/list")
   
})
// ajax body, form 등으로 전송가능

// fetch('/URL~~', {
//     method : 'POST',
//     headers : { 'Content-Type' : 'application/json' },
//     body : JSON.stringify({a : 1})
//   })
// query  /abc?age=20  console.log(req.query) === {age: 20}
// query /abc?age=20&name=홍길동 ==={age:20, name: 홍길동}

// params /abc/:id 입력한 무언가 /abc/홍길동 console.log(req.params) === {id: 홍길동}


//  awiat db.collection('post').updateOne({_id:1}, {${inc: {like: -2}}})

// updateOne 수정
// findOne 조회
// insertOne 작성
//.find().toArray() 조회 배열로 받아오기 


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

//commitss
//commit 