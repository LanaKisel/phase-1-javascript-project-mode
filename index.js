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
                btn1.textContent = "Previous art work";
                btn1.id = "btn1"
                const btn2 = document.createElement('button');
                btn2.textContent = "Next art piece";
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
                    let firstArt = data[index]
                    document.querySelector('#galleryItem').src = firstArt.imageUrl
                    document.querySelector("#page_wrapper").classList.remove("hidden")
                    const artWork = document.querySelector("#artWork");
                    console.log(artWork);
                    // const art = document.querySelector("#artDescription")
                    //console.log(art)
                    // art.addEventListener('mouseover', (event) => {
                    //     console.log('mouseover event')
                    //     event.target.style.color = "orange"
                    //     setTimeout(() => {
                    //         event.target.style.color = "";
                    //     }, 500);
                    // }, false,)
                    let h3 = document.createElement('h1');
                    h3.textContent = data[index].title
                    let author = document.createElement('h4');
                    author.textContent = data[index].author
                    art.appendChild(h3);
                    art.appendChild(author);
                    const p = document.createElement('p');
                    p.textContent = data[index].description;
                    art.appendChild(p);
                    const a = document.createElement('a');
                    a.href = data[index].wikipediaUrl;
                    a.textContent = `Wikipedia article: ` + data[index].title;
                    console.log(a)
                    art.appendChild(a);
                    artWork.appendChild(btn1);
                    artWork.appendChild(btn2);
                    // const form = document.querySelector('form')
                    getAllCommentsForArtWorkById(firstArt.id);
                    // form.addEventListener('submit', function (event) {
                    //     event.preventDefault();
                        // fetch('http://localhost:3000/comments', {
                        //     method: "POST",
                        //     headers: {
                        //         "Content-Type": "application/json",
                        //         "Accept": "application/json"
                        //     },
                        //     body: JSON.stringify({
                        //         "artworkId": data[index].id,
                        //         "name": document.querySelector(".text").value,
                        //         "comment": document.querySelector(".input-text").value
                        //     })
                        // })
                        //     .then(res => res.json())
                        //     .then(data => {
                        //         console.log(data)
                        //         const commentary = document.querySelector(".input-text").value;
                        //         const personWhoComments = document.querySelector(".text").value;
                        //         addsComment(personWhoComments, commentary);
                        //     })
                  //  })
                    document.querySelector("#artDescription").childNodes.remove;
                }
            })
    })
})