var express = require('express');
var players = [];
var app = express();

//SERVER IP: http://192.168.1.157:8000/
//SERVER SETUP
var server = app.listen(process.env.PORT || 3000, listen);
function listen() {
  var host = "192.168.56.1"; // localhost
  //var host = "172.17.5.83"; // default gateway
  var port = server.address().port;
    console.clear();
    console.log("  ////////////////////// SERVER STARTED /////////////////////////");
    console.log(" //////// Listening at http://" + host + ':' + port + " ///////////////");
    console.log("///////////////////////////////////////////////////////////////");
}
app.use(express.static('public'));
var io = require('socket.io')(server);
//////////////

//cd onedrive\documents\programming projects\githubio\cardsagainsthumanity

var player_count = 0;
var player_list = [];
var question = null;
var questions =  [
    "Class, pay close attention./I will now demonstrate the /physics of ___.",
    "Coming to theaters this/ holiday season, /'Star Wars: The Rise of ___.'",
    "Never fear, Captain ___ is here!",
    "I don’t really know what/ my mom’s job is, but /I think it has something /to do with ___.",
    "What’s about to take this /school dance to the next level?",
    "Shut up, Becky! At least I’m not ___.",
    "Oh, no thank you, Mrs. Lee. /I’ve had plenty of ___ for now.",
    "MY NAME CHUNGO. /CHUNGO LOVE ___.",
    "Did you think you/ could escape from ___?",
    "Beep beep! ___ coming through!",
    "My favorite book is /'The Amazing Adventures of ___.'",
    "We’re off to see the wizard,/ the wonderful wizard of ___!",
    "Boys? No. ___? Yes!",
    "At school, I’m just Mandy. /But at summer camp, /I’m '___ Mandy.'",
    "We’re not supposed to go in the attic. /My parents keep ___ in there.",
    "Outback Steakhouse: /No rules. Just ___.",
    "I have invented a new sport. /I call it '___ ball.'",
    "Bow before me, /for I am the Queen of ___!",
    "Guys, stop it! /There’s nothing funny about ___.",
    "Thanks for watching! /If you want to see more vids of ___, /smash that subscribe.",
    "Hey, kids. I’m Sensei Todd. /Today, I’m gonna teach you how to /defend yourself against ___.",
    "There’s nothing better than /a peanut butter and ___ sandwich.",
    "CHUNGO FEEL SICK. /CHUNGO NO LIKE ___ ANYMORE.",
    "What killed Old Jim?",
    "Oh Dark Lord, we show our /devotion with a humble offering of ___!",
    "Mom? You have to come pick me up! /There’s ___ at this party. ",
    "Run, run, as fast as you can. /You can’t catch me, I’m ___!",
    "They call me 'Mr.___.'",
    "New from Mattel! /It’s BUNGO: The Game of ___.",
    "One nation, under God, /indivisible, with liberty /and ___ for all.",
    "Moms love ___.",
    "My name is Peter Parker. /I was bitten by a /radioactive spider, and now I’m ___.",
    "The easiest way to tell me and /my twin apart is that I have a /freckle on my cheek and she’s ___.",
    "It’s BIG. It’s SCARY. It’s ___!",
    "My dad and I enjoy ___ together.",
    "Attention students. This is /Principal Butthead. /Please remember that we /do not allow ___ in the hallway. /Thank you.",
    "Well, look at what we have here! /A big fancy man walkin’ /in like he’s ___.",
    "Did you know that /Benjamin Franklin invented ___?",
    "Ladies and gentlemen, /I have discovered something amazing. /I have discovered ___.",
    "Coming soon! Batman vs. ___.",
    "Ew. Grandpa smells like ___.",
    "Kids, Dad is trying something /new this week. It’s called '___.'",
    "James Bond will /return in 'No Time for ___.'",
    "The warm August air was /filled with change. /Things were different,/ for Emily was now ___.",
    "The aliens are here. They want ___.",
    "Hey guys. I just want to tell /all my followers who are struggling /with ___:it DOES get better.",
    "Madam President, /we’ve run out of time. /The only option is ___.",
    "Now in bookstores: /Nancy Drew and the Mystery of ___.",
    "Where do babies come from?",
    "Alright, which one of you /little turds is responsible for ___?!",
    "This is gonna be the best /sleepover ever. Once Mom and /Dad go to bed, it’s time for ___!",
    "You don’t love me, Sam. /All you care about is ___.",
    "Huddle up, Wildcats! /They may be bigger./ They may be faster./ But we’ve got a secret weapon: ___.",
    
    "Come on, Danny. All the /cool kids are doin’ it. /Wanna try ___?",
    "Today we honor St. Mungo,/ the patron saint of ___.",
    "Me and my friends don’t /play with dolls anymore. /We’re into ___ now.",
    "ENOUGH! I will not ___ /let tear this family apart!",
    "I lost my arm in a /___ accident. ",
    "Police! Arrest this man! He’s ___.",
    "Time to put on my favorite/ t-shirt, the one that says /'I heart ___.'",
    "When I pooped, what /came out of my butt?",
    "Before I attend your/ sleepover, I must inform you: /toys bore me, and I don’t /care for sweets. I prefer ___.",
    "Next from J.K.Rowling: /Harry Potter and the Chamber of ___.",
    "Come with me, and I will /show you a world of ___.",
    "Isn’t this great, honey? /Just you, me, the kids, and ___.",
    "Hey, check out my band! /We’re called 'Rage Against ___.'",
    "Whoa there, partner! /Looks like ___ spooked my horse. ",
    "Joey, look out behind you! It’s ___!",
    "___? No.",
    "ME HUNGRY. ME WANT ___.",
];

var answers = [
    "Being dead. ",
    "Filling my butt /with spaghetti.",
    "Eating a whole /roll of toilet paper.",
    "Peer pressure.",
    "Idiots.",
    "Slowly turning /into cheese.",
    "Using my butt/ as a microwave.",
    "Crab-walking from /the toilet to get /more toilet paper.",
    "The garbage man.",
    "Getting married.",
    "Mashing a banana /into your belly button.",
    "Saving up my /boogers for ten/ years and then building /the world’s largest booger.",
    "Coffee.",
    "Diarrhea.",
    "Falling in love.",
    "Drinking gasoline /to see what it /tastes like.",
    "My father, who /is a walrus.",
    "Not wearing pants.",
    "The dentist.",
    "The baby.",
    "Old Jim’s /Steamy Butt Sauce.",
    "Boys.",
    "Beautiful/ grandma.",
    "Running away /from home.",
    "Nunchucks. ",
    "Bench pressing /a horse.",
    "Stuffing my underwear /with pancakes.",
    "Mayonnaise. ",
    "Pee-pee.",
    "Obama.",
    "BULBASAUR.",
    "How much wood a /woodchuck would chuck /if a woodchuck could/ chuck wood.",
    "The oppressive /system of capitalism.",
    "Big butt cheeks /filled with poop.",
    "Crying in the /bathroom.",
    "One tough mama. ",
    "Spending my parents’/ hard-earned money.",
    "Chungo, the /talking gorilla.",
    "Biting a rich person.",
    "Chest hair.",
    "The bus driver.",
    "Going bald.",
    "Putting my butt/ on stuff.",
    "Drinking a whole /bottle of ketchup.",
    "Sacrificing /Uncle Tim.",
    "Peeing in the /cat’s litter box.",
    "Murdering.",
    "Butts of all /shapes and sizes.",
    "A whole lot of /cottage cheese.",
    "Freeing a fart /from its butt prison.",
    "Butt surgery.",
    "Getting stuck /in the toilet.",
    "Supreme Court /Justice Ruth Bader/ Ginsburg.",
    "The Underground /Railroad.",
    "A doll that /pees real pee!",
    "John Wilkes Booth.",
    "Love.",
    "Knives.",
    "Satan.",
    "Jesus.",
    "Putting my brain /into the body /of a tiger.",
    "Unleashing a hell/ demon that will /destroy our world.",
    "Abraham Lincoln.",
    "Thick, nasty burps.",
    "Having a really /big head.",
    "Getting drunk.",
    "Screaming into /a can of Pringles.",
    "Batman.",
    "Cheeto fingers.",
    "Elegant party hats.",
    "Climbing into a /cow’s butt.",
    "Whatever mom /does at work.",
    "Sitting on a cake. ",
    "Overthrowing /the government.",
    "Butthole.",
    "Stuff.",
    "Pork.",
    "Shoplifting.",
    "Gluing my butt /cheeks together.",
    "Respecting /personal boundaries.",
    "Barfing into a /popcorn bucket.",
    "The huge, /stupid moon.",
    "Dump cake.",
    "Principal Butthead.",
    "My girlfriend,/ who goes to /another school.",
    "Drinking out of /the toilet and/ eating garbage.",
    "Farting a lot today.",
    "SILENCE! ",
    "Getting a skull /tattoo.",
    "Getting shot out /of a cannon.",
    "Sharks.",
    "The Russians.",
    "Shaving Dad’s back.",
    "A hot air balloon/ powered by fart gas.",
    "Getting slapped /with a fish.",
    "Cigarettes.",
    "Water.",
    "Boogers.",
    "Baby Yoda.",
    "Dancing with/ my son.",
    "A big, and I /mean BIG turtle.",
    "Mowing the/ stupid lawn.",
    "Chugging a gallon of/ milk and then vomiting /a gallon of milk.",
    "Beer. ",
    "Thousands of /lasagna.",
    "Person milk.",
    "Having many /husbands.",
    "Most of a horse.",
    "The British.",
    "Tossed salads/ and scrambled eggs.",
    "Old people. ",
    "Blasting farts in/ the powder room.",
    "The beautiful /potato.",
    "Dwayne “The Rock” /Johnson.",
    "A butt that /eats underwear.",
    "A dead body.",
    "Climate change.",
    "Failure.",
    "Hogs.",
    "Throwing up /double peace signs/ with my besties/ at Starbucks.",
    "An old, dirty /cat with bad breath.",
    "The terrible /winter of 1609.",
    "The government.",
    "The way grandpa /smells.",
    "Greta Thunberg.",
    "Dad’s meatloaf. ",
    "Living in the /dumpster.",
    "Feasting upon /human flesh.",
    "A big sad dragon /with no friends.",
    "Butt hair.",
    "Licking a used/ bandaid.",
    "Mom’s butt.",
    "Only beans.",
    "Covering myself /with ketchup and /mustard because /I am hot dog.",
    "Naked people.",
    "A baby boomer.",
    "A baby with a full mustache.",
    "The first female/ President of the /United States /of America.",
    "Moving to Ohio.",
    "Fat stacks /of cash.",
    "Mom’s new haircut.",
    "Getting a girlfriend.",
    "Getting kicked /in the nuts.",
    "Voldemort.",
    "Big, juicy pimples.",
    "A turd that /just won’t flush.",
    "Josh. ",
    "Beyoncé.",
    "Questioning authority.",
    "A bird pooping /on the president’s head.",
    "14 cheeseburgers, 6 large /fries, and a/ medium Sprite.",
    "This stupid game.",
    "A scoop of tuna.",
    "China.",
    "Swords.",
    "A poop as big as Mom.",
    "Punching everyone.",
    "Burning books. ",
    "Making out in a closet.",
    "My annoying sister.",
    "Teeny, tiny turds. ",
    "Illegal drugs. ",
    "Being super /serious right now.",
    "The whole family. ",
    "Chunks.",
    "Grandma panties.",
    "Many wolves.",
    "Shutting up.",
    "Cat pee.",
    "Having no friends.",
    "The entire /state of Texas.",
    "Giggling and farting/ and slurping /milkshakes.",
    "Ariana Grande.",
    "Putting an apple/ in a little boy’s/ mouth and roasting /him for dinner.",
    "Getting sucked /into a jet engine.",
    "My parents.",
    "A dead whale.",
    "Sitting on the /toilet and going poop.",
    "Space lasers.",
    "Never showering.",
    "Politics.",
    "Kevin’s mom.",
    "Getting run over /by a train.",
    "Sniffing a dog’s butt.",
    "A fake kid made /out of wood.",
    "An owl that/ hates you.",
    "My big donkey /brother.",
    "The sweet honking /of Karen’s bassoon.",
    "Getting scalded /in the face with hot beans.",
    "Being French,/ hoh-hoh-hoh!",
    "This goat, /who is my friend.",
    "Rich people /Smelling like onions.",
    "Pooping barf/ forever.",
    "Being adopted.",
    "The old man with /the rake who lives down /the dark and /winding road.",
    "Locking Mother/ in the pantry.",
    "Fortnite.",
    "Farting and /walking away.",
    "Being famous /on YouTube.",
    "Going around /sniffing people’s armpits.",
    "Racism, sexism,/ and homophobia.",
    "Legs.",
    "Big, slappy hands.",
    "The gluteus maximus.",
    "One weird lookin’ toe.",
    "Punching a guy /through a wall.",
    "Having a baby.",
    "Getting naked. ",
    "A planet-devouring /space worm named /“Rachel.”",
    "Evil.",
    "A super angry cat /I found outside.",
    "Forgetting to /put on underwear.",
    "Getting my /ponytail stuck.",
    "Poo-poo.",
    "Becoming taller/ and stronger /than Father.",
    "Teaching a /chicken to kill.",
    "Doing karate.",
    "Twerking.",
    "Becoming the/ president.",
    "Hurting /people’s feelings.",
    "A Republican.",
    "JoJo Siwa. ",
    "Blasting my /math teacher into /the sun.",
    "One long hair /growing out of a mole.",
    "A nice, warm /glass of pee.",
    "Bursting /into flames.",
    "The babysitter. ",
    "My future husband.",
    "My sister’s /stupid boyfriend.",
    "Coming back /from the dead.",
    "Having to/ pee so bad.",
    "Feminism.",
    "Spider-Man.",
    "A screaming/ soccer dad.",
    "Pooping on the/ neighbor’s lawn.",
    "Mom’s friend, Donna.",
    "Fake news.",
    "Nothing.",
    "Your face.",
    "Uranus.",
    "Barf.",
    "Stank breath.",
    "Going night night.",
    "Taking a dump in /the pool.",
    "Building a ladder/ of hot dogs to /the moon.",
    "A bear.",
    "A Democrat.",
    "The middle finger.",
    "Trying to catch /that dang raccoon.",
    "An order of /mozzarella sticks.",
    "Harry Potter.",
    "A bunch of dead/ squirrels on a /trampoline.",
    "Grandpa.",
    "A flamethrower.",
    "Blowing up the Moon.",
    "Girls.",
    "A hug.",
    "Lighting stuff/ on fire.",
    "Living in a pineapple /under the sea.",
    "Social media.",
    "Triangles. ",
    "A hundred/ screaming monkeys.",
    "Going to Hell.",
    "A black hole. ",
    "The octopus stuck /to my face.",
    "Wiping my butt.",
    "Complaining.",
    "Soup.",
    "Garbage.",
    "Your mom!",
    "Literally ruining/ my life.",
    "Stealing people’s/ money and going to jail.",
    "Turning 40.",
    "Death.",
    "Ham.",
    "Eating a baby.",
    "Bad parenting.",
    "Trees.",
    "Lice.",
    "Pizza.",
    "Cavities.",
    "Flushing myself /down the toilet.",
    "A pregnant person.",
    "brother.",
    "Cheetos.",
    "A killer clown.",
    "Me.",
    "You.",
    "Shrek.",
];
var final_answers = [];
var answerDeck;
var answer_count = 0;
class player {
    constructor(sID, val) {
        this.id = sID;
        this.name = "Player";
        this.mode = "p";
        this.cards = [
            {card_val: ""}, 
            {card_val: ""}, 
            {card_val: ""}, 
            {card_val: ""}, 
            {card_val: ""}, 
            {card_val: ""}, 
            {card_val: ""}, 
            {card_val: ""}, 
            {card_val: ""}, 
            {card_val: ""}, 
        ];
        this.score = 0;
    }
}

io.sockets.on('connection', function (socket) {
    console.log("[" + getTime() + "] SERVER: Client connected: " + socket.id);
    player_list.push(new player(socket.id, (player_list.length + 1)));
    broadcast_player_list();
    //console.log(player_list);
    
    socket.on('disconnect', function() {
        console.log("[" + getTime() + "] SERVER: Client has disconnected");
        
        for (i = 0; i < player_list.length; i++) {
            if (socket.id == player_list[i].id) {
                player_list.splice(i, 1);
            
                break;
            }
        }
        
    });
    
    
    socket.on("name_change", function(id, name) {
        var ind = find_index(player_list ,id);
        player_list[ind].name = name;
        
        broadcast_player_list();
    });
    
    
    socket.on("start_game", function() {
        final_answers = [];
        answer_count = 0;
        select_question();
        console.log("[" + getTime() + "] SERVER: Selected Question");
        broadcast_q();
        console.log(question);
        answerDeck = answers;
        ShuffleCards(answerDeck);
        ShuffleCards(answerDeck);
        ShuffleCards(answerDeck);
        ShuffleCards(answerDeck);
        
        for (i = 0; i < player_list.length; i++) {
            for (t = 0; t < 10; t++) {
                player_list[i].cards.splice(0,1);
                player_list[i].cards.push({card_val: answerDeck[0]});
                answerDeck.splice(0, 1);
            }    
        }
         
        broadcast_player_list();
        io.sockets.emit("selectableON");
        
    });
    
    
    socket.on("log_list", function() {
        console.log("[" + getTime() + "] SERVER: Player list:: ", player_list);
    });
    
    socket.on("new_round", function() {
        console.log("[" + getTime() + "] SERVER: New Round");
        
        final_answers = [];
        answer_count = 0;
        
        let lastQ = question;
        
        select_question();
        if (question == lastQ) {
            select_question();
        }
        
        console.log("[" + getTime() + "] SERVER: Selected Question");
        broadcast_q();
        console.log(question);
        
        io.sockets.emit("remove_answer");

    });
    
    
    socket.on("tvMode", function(id) {
        var ind = find_index(player_list ,id);
        player_list[ind].mode = "t";
        broadcast_player_list();
        io.sockets.emit("set_tv", id);
    });
    
    socket.on("selected_card", function(id, card_val) {
        final_answers.push({id, card_val});        
        answer_count++;
        
        if (answer_count >= player_list.length - 1) {
            io.sockets.emit("selectableOFF");
            show_answers();
        }
        
    });
    
    socket.on("answer_removed", function(pl_crds, id) {
        
        var c = pl_crds;
        
        ShuffleCards(answerDeck);
        ShuffleCards(answerDeck);
        ShuffleCards(answerDeck);
        ShuffleCards(answerDeck);
        
        c.push({card_val: answerDeck[0]});
        answerDeck.splice(0, 1);
        
        player_list[find_index(player_list, id)].cards = c;
        
        if (answerDeck.length < 10) {
            answerDeck = answers;
        }
        
        broadcast_player_list();
        io.sockets.emit("selectableON");
    });
    
    
    
});

function show_answers() {
    io.sockets.emit("show_answers", final_answers);
}

function ShuffleCards(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        
        return a;
    }

function select_question() {
    question = questions[rand(0, (questions.length - 1))];
}

function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rndInt(min, max) {
  return Math.random() * (max - min) + min;
}

function find_index(list, item) {
    for(i = 0; i < list.length; i++) {
        if (list[i].id == item) {
            return i;
            
        }
    }
    
    return false;
}

function broadcast_q() {
    io.sockets.emit("question", question);
}

function broadcast_player_list() {
    io.sockets.emit("update_player", player_list);
}

function getTime() {
    var d = new Date();
    var hr = d.getHours();
    var min = d.getMinutes();
    var sec = d.getSeconds();
    if (min < 10) {
        min = "0" + min;
    }
    
    if (sec < 10) {
        sec = "0" + sec;
    }
    var ampm = " AM";
    if( hr > 12 ) {
        hr -= 12;
        ampm = " PM";
    }
    
    var t = hr + ":" + min + ":" + sec + ampm;
    
    return t 
}


//pick question
//give 10 cards each
//everyone give 1 card answer
//show each answer
//select winner
//give points to winner
//add 1 card to players
//restart
