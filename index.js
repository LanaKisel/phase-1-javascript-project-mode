let currentArtworkId = undefined;
let allArtworks = [];
function updateDisplay(index) {
    let likes = document.querySelector('#likeCount');
    const art = document.querySelector("#artDescription"); 
    let btn1 = document.getElementById("btn1");
    let btn2 = document.getElementById('btn2');
    let btn3 = document.getElementById("btn3");
    console.log("data", allArtworks);
    console.log("index", index);
    console.log(allArtworks[index].id);
    console.log("thes are likes: ", allArtworks[index].likes)

    currentArtworkId = allArtworks[index].id;
    document.querySelector("#artDescription").innerHTML = ""
    let currentArtPiece = allArtworks[index]
    document.querySelector('#galleryItem').src = currentArtPiece.imageUrl;
    const artWork = document.querySelector("#artWork");
    console.log(artWork);
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
    document.querySelector("#artDescription").childNodes.remove;
    //let likes = document.querySelector('#likeCounts');
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
    fetch('http://localhost:3000/comments', {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(data => {

            let filteredComments = data.filter((comments) => {
                return comments.artworkId === artworkId
            })
            filteredComments = filteredComments.splice(-5)

            for (element of filteredComments) {

                addsComment(element.name, element.comment)
            }
        })
}

document.addEventListener("DOMContentLoaded", () => {
    let likes = document.querySelector('#likeCount');
    const art = document.querySelector("#artDescription");
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
        console.log("name length", name.length);
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
                likes.innerHTML=data[index].likes
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
                let btn1 = document.getElementById("btn1");
                let btn2 = document.getElementById('btn2');
                let btn3 = document.getElementById("btn3");
                console.log(curIndex);

                if (!btn1) {
                    btn1 = document.createElement('button');
                    btn1.textContent = "<< Previous gallery item";
                    btn1.id = "btn1";
                    btn1.addEventListener("click", function (e) {
                        console.log(curIndex)
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
                // function updateDisplay(index) {
                //     console.log("data", allArtworks);
                //     console.log("index", index);
                //     console.log(allArtworks[index].id);
                //     console.log("thes are likes: ", allArtworks[index].likes)

                //     currentArtworkId = allArtworks[index].id;
                //     document.querySelector("#artDescription").innerHTML = ""
                //     let currentArtPiece = allArtworks[index]
                //     document.querySelector('#galleryItem').src = currentArtPiece.imageUrl;
                //     const artWork = document.querySelector("#artWork");
                //     console.log(artWork);
                //     let h3 = document.createElement('h1');
                //     h3.textContent = currentArtPiece.title
                //     let author = document.createElement('h4');
                //     author.textContent = currentArtPiece.author
                //     art.appendChild(h3);
                //     art.appendChild(author);
                //     const p = document.createElement('p');
                //     p.textContent = currentArtPiece.description;
                //     art.appendChild(p);
                //     const a = document.createElement('a');
                //     a.href = currentArtPiece.wikipediaUrl;
                //     a.textContent = `Wikipedia article: ` + currentArtPiece.title;
                //     console.log(a)
                //     art.appendChild(a);
                //     artWork.appendChild(btn3);
                //     artWork.appendChild(btn1);
                //     artWork.appendChild(btn2);
                //     getAllCommentsForArtWorkById(currentArtworkId);
                //     document.querySelector("#artDescription").childNodes.remove;
                //     //let likes = document.querySelector('#likeCounts');
                //     if( allArtworks[index].likes==undefined) {
                //         likes.textContent=0
                //     } else {
                //     likes.textContent=allArtworks[index].likes
                // }
                // }
            })
    })

    const indexUpdated = function (galleryItems) {

        console.log("Index Value: ", curIndex);
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
    likeButton.addEventListener("click", function(){
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
        .then(res=>res.json())
        .then(data=>{console.log(data);
            //document.querySelector("#likeCount").innerText=data.likes; 
            //likes.innerText=data.likes; 
            allArtworks[curIndex] = data;
            updateDisplay(curIndex)
        })        
    }        
    )
})