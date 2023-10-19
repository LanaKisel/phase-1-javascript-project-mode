let currentArtworkId = undefined;

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
            for (element of filteredComments) {
                addsComment(element.name, element.comment)
            }
        })
}
document.addEventListener("DOMContentLoaded", () => {
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
        fetch('http://localhost:3000/comments', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "artworkId": currentArtworkId,
                "name": document.querySelector(".text").value,
                "comment": document.querySelector(".input-text").value
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const commentary = document.querySelector(".input-text").value;
                const personWhoComments = document.querySelector(".text").value;
                addsComment(personWhoComments, commentary);
            })
    })

    const beginButton = document.querySelector("#begin").addEventListener('click', () => {
        fetch('http://localhost:3000/artWork', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                const btn1 = document.createElement('button');
                btn1.textContent = "<< Previous gallery item";
                btn1.id = "btn1"
                const btn2 = document.createElement('button');
                btn2.textContent = "Next gallery item >>";
                let curIndex = 0;
                updateDisplay(curIndex);
                btn1.addEventListener("click", function (e) {
                    curIndex--;
                    if (curIndex < 0) {
                        curIndex = 0;
                    }
                    updateDisplay(curIndex);
                });
                btn2.addEventListener('click', function (e) {
                    curIndex++;

                    if (curIndex > 5) {
                        curIndex = 5;
                    }
                    updateDisplay(curIndex);
                })
                function updateDisplay(index) {
                    currentArtworkId = data[index].id;
                    document.querySelector("#artDescription").innerHTML = ""
                    document.querySelector("#gallery-header").classList.add("hidden");
                    let currentArtPiece = data[index]
                    document.querySelector('#galleryItem').src = currentArtPiece.imageUrl
                    document.querySelector("#page_wrapper").classList.remove("hidden")
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
                    artWork.appendChild(btn1);
                    artWork.appendChild(btn2);
                    getAllCommentsForArtWorkById(currentArtPiece.id);
                    document.querySelector("#artDescription").childNodes.remove;
                }
            })
    })
})