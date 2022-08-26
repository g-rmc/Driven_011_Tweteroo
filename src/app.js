import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const users = [{
    id: 0,
    username: "bobesponja",
    avatar: "https://super.abril.com.br/wp-content/uploads/2020/09/04-09_gato_SITE.jpg?quality=70&strip=info"
}];

const tweets = [{
    id: 0,  
    username: "bobesponja",
    tweet: "eu amo o hub"
}];

app.post('/sign-up', (req, res) => {
    const { username, avatar} = req.body;
    if (!username || username === '' || !avatar || avatar === ''){
        res.status(400).send('Todos os campos são obrigatórios!');
        return;
    }
    users.push({
        id: users.length,
        username,
        avatar
    });
    res.status(201).send('OK');
});

app.post('/tweets', (req, res) => {
    const {tweet} = req.body;
    const username = req.headers.user;
    if (!username || username === '' || !tweet || tweet === ''){
        res.status(400).send('Todos os campos são obrigatórios!');
        return;
    }
    tweets.push({
        id: tweets.length,
        username,
        tweet
    });
    res.status(201).send(tweets);        
});

app.get('/tweets', (req, res) => {
    const page = Number(req.query.page);
    if (isNaN(page) || page <= 0){
        res.status(400).send('Informe uma página válida!');
        return;
    }
    let tweetsList = getTweets(req.query.page);
    tweetsList = tweetsList.map(addAvatar);
    res.send(tweetsList.reverse());
});

app.get('/tweets/:USERNAME', (req, res) => {
    const username = req.params.USERNAME;
    let userTweets = tweets.filter(value => value.username === username);
    userTweets = userTweets.map(addAvatar);
    res.send(userTweets.reverse());
})

function getTweets(page) {
    const pageNum = Number(page)-1;
    const from = 0 + 10*pageNum;
    const to = 9 + 10*pageNum;
    const arr = tweets.filter((value, index) => index <= tweets.length-from && index >= tweets.length-from-to);
    return arr
};

function addAvatar(value) {
    const user = users.find(element => element.username === value.username);
    value.avatar = user.avatar;
    return value
};

app.listen('5000', () => console.log('Listening on 5000'));