let currentArtworkId = undefined;
let allArtworks = [];
let btn1 = document.getElementById("btn1");
let btn2 = document.getElementById('btn2');
let btn3 = document.getElementById("btn3");
function updateDisplay(index) {
    let likes = document.querySelector('#likeCount');
    const art = document.querySelector("#artDescription");
    currentArtworkId = allArtworks[index].id;
    document.querySelector("#artDescription").innerHTML = ""
    let currentArtPiece = allArtworks[index]
    document.querySelector('#galleryItem').src = currentArtPiece.imageUrl;
    const artWork = document.querySelector("#artWork");
    //creating description of art wokrs
    let h3 = document.createElement('h1');
    h3.textContent = currentArtPiece.title
    let author = document.createElement('h4');
    author.textContent = currentArtPiece.author
    art.appendChild(h3);
    art.appendChild(author);
    const p = document.createElement('p');
    p.textContent = currentArtPiece.description;
    art.appendChild(p);
    const a = document.createElement('a');
    a.href = currentArtPiece.wikipediaUrl;
    a.textContent = `Wikipedia article: ` + currentArtPiece.title;
    console.log(a)
    art.appendChild(a);

    getAllCommentsForArtWorkById(currentArtworkId);
    //clears artwork description: 
    document.querySelector("#artDescription").childNodes.remove;

    if (allArtworks[index].likes == undefined) {
        likes.textContent = 0
    } else {
        likes.textContent = allArtworks[index].likes
    }
}
function addsComment(name, comment) {
    const feedback = document.createElement('p');
    feedback.textContent = comment;
    const feedbackName = document.createElement('p');
    feedbackName.textContent = name;
    document.querySelector(".holdFeedback").appendChild(feedback);
    document.querySelector(".nameHolder").appendChild(feedbackName);
    document.querySelector("#feedback").reset();
}
function getAllCommentsForArtWorkById(artworkId) {
    document.querySelector(".holdFeedback").innerHTML = "";
    document.querySelector(".nameHolder").innerHTML = "";
    //fetch that gets comments from input
    fetch('http://localhost:3000/comments', {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(data => {
            //filters comments for specific artwork 
            let filteredComments = data.filter((comments) => {
                return comments.artworkId === artworkId
            })
            //displays only last 5 comments
            filteredComments = filteredComments.splice(-5);
            //adds name and comment 
            for (element of filteredComments) {
                addsComment(element.name, element.comment)
            }
        })
}

document.addEventListener("DOMContentLoaded", () => {
    let likes = document.querySelector('#likeCount');
    const art = document.querySelector("#artDescription");
    //mouseover event on description of artwork
    art.addEventListener('mouseover', (event) => {
        console.log('mouseover event')
        event.target.style.color = "orange"
        setTimeout(() => {
            event.target.style.color = "";
        }, 500);
    }, false,);

    const form = document.querySelector('form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        let name = document.querySelector(".text").value;
        let comment = document.querySelector(".input-text").value;
        //if no name entered, default to "anonymous"
        if (name.length == 0) {
            name = "anonymous"
        };
        
        fetch('http://localhost:3000/comments', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "artworkId": currentArtworkId,
                "name": name,
                "comment": comment
            })
        })
            .then(res => res.json())
            .then(data => {
                likes.innerHTML = currentArtworkId.likes
                getAllCommentsForArtWorkById(currentArtworkId);
            })
    })
    let curIndex = 0;

    const beginButton = document.querySelector("#begin").addEventListener('click', () => {
        curIndex = 0;
        fetch('http://localhost:3000/artWork', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                allArtworks = data;

                if (!btn1) {
                    btn1 = document.createElement('button');
                    btn1.textContent = "<< Previous gallery item";
                    btn1.id = "btn1";
                    btn1.addEventListener("click", function (e) {
                        curIndex--;
                        indexUpdated(data.length)
                        if (curIndex < 0) {
                            document.querySelector("#gallery-header").classList.remove("hidden");
                            document.querySelector("#page_wrapper").classList.add("hidden")
                        } else if (curIndex == 0) {
                            this.textContent = "<< Exit gallery";
                            updateDisplay(curIndex);
                        } else {
                            btn2.textContent = "Next gallery item >>";
                            updateDisplay(curIndex);
                        }
                        //updateDisplay(curIndex);
                    });
                }
                if (!btn2) {
                    btn2 = document.createElement('button');
                    btn2.id = 'btn2';
                    btn2.textContent = "Next gallery item >>";
                    btn2.addEventListener('click', function (e) {
                        curIndex++;
                        indexUpdated(data.length);
                        if (curIndex > data.length - 1) {
                            document.querySelector("#gallery-header").classList.remove("hidden");
                            document.querySelector("#page_wrapper").classList.add("hidden");
                        } else if (curIndex == data.length - 1) {
                            this.textContent = "Exit gallery  >>";
                            updateDisplay(curIndex);
                        } else {
                            btn1.textContent = "<< Previous gallery item";
                            updateDisplay(curIndex);
                        }
                    });
                }
                if (!btn3) {
                    btn3 = document.createElement('button');
                    btn3.id = 'btn3';
                    btn3.textContent = 'Exit gallery';
                    btn3.addEventListener('click', function (e) {
                        indexUpdated(data.length);
                        document.querySelector("#gallery-header").classList.remove("hidden");
                        document.querySelector("#page_wrapper").classList.add("hidden");
                        updateDisplay(curIndex);
                    })

                }

                const artWork = document.querySelector("#artWork");
                artWork.appendChild(btn3);
                artWork.appendChild(btn1);
                artWork.appendChild(btn2);

                btn2.textContent = "Next gallery item >>"
                btn1.textContent = "Exit gallery"
                document.querySelector("#gallery-header").classList.add("hidden");
                document.querySelector("#page_wrapper").classList.remove("hidden");
                updateDisplay(curIndex);
                indexUpdated(data.length);
            })
    })

    const indexUpdated = function (galleryItems) {

        //console.log("Index Value: ", curIndex);
        if (curIndex <= 0 && galleryItems == 1) {
            btn3.classList.add('hidden')
            console.log("I'm on the ONLY gallery item!");
        } else if (curIndex <= 0) {
            btn3.classList.add('hidden')
            console.log("I'm on the first gallery item!");
        } else if (curIndex == galleryItems - 1) {
            btn3.classList.add('hidden')
            console.log("I'm on the last gallery item!");
        } else {
            btn3.classList.remove('hidden')
            console.log("I'm somewhere in-between gallery items!");
        }
    }

    let likeButton = document.querySelector('#like');
    likeButton.addEventListener("click", function () {
        //converting string to a number
        let numberOfLikesRightNow = Number(likes.textContent);
        numberOfLikesRightNow++
        fetch(`http://localhost:3000/artWork/${currentArtworkId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "likes": numberOfLikesRightNow
            })
        })
            .then(res => res.json())
            .then(data => {
                allArtworks[curIndex] = data;
                updateDisplay(curIndex)
            })
    }
    )
})