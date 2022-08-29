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
    const userSameName = users.find(user => user.username === username);
    if (userSameName !== undefined){
        res.status(409).send('Usuário já cadastrado!');
        return;
    }
    if (!username || !avatar){
        res.status(400).send('Todos os campos são obrigatórios!');
        return;
    }
    if (!isValidHttpUrl(avatar)){
        res.status(400).send('Endereço de imagem não é válido');
        return;
    }
    if (username.indexOf(" ") !== -1){
        res.status(400).send('Username não pode contar espaço');
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
    const {user} = req.headers;
    if (!user || !tweet){
        res.status(400).send('Todos os campos são obrigatórios!');
        return;
    }
    tweets.push({
        id: tweets.length,
        username: user,
        tweet
    });
    res.status(201).send('OK');        
});

app.get('/tweets', (req, res) => {
    const page = Number(req.query.page);
    if (isNaN(page) || page <= 0){
        res.status(400).send('Informe uma página válida!');
        return;
    }
    let tweetsList = getTweets(req.query.page);
    tweetsList = tweetsList.map(addAvatar);
    res.send(tweetsList);
});

app.get('/tweets/:USERNAME', (req, res) => {
    const username = req.params.USERNAME;
    let userTweets = tweets.filter(value => value.username === username);
    userTweets = userTweets.map(addAvatar);
    userTweets.reverse();
    res.send(userTweets);
})

function getTweets(page) {
    const pageNum = Number(page)-1;
    const from = 0 + (10*pageNum);
    const to = 9 + (10*pageNum);
    const aux = [... tweets];
    aux.reverse();
    const arr = aux.filter((value, index) => index >= from && index <= to);
    return arr
};

function addAvatar(value) {
    const user = users.find(element => element.username === value.username);
    value.avatar = user.avatar;
    return value
};

function isValidHttpUrl(string) {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
    return true;
  }

app.listen('5000', () => console.log('Listening on 5000'));