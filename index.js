
document.addEventListener("DOMContentLoaded", () => {

        const beginButton  = document.querySelector("#begin").addEventListener('click', ()=>{
        fetch('http://localhost:3000/artWork',  {method: "GET",
        headers: {
          "Content-Type": "application/json"
    }})
    .then(res=>res.json())
    .then(data=>{
        document.querySelector("#gallery-header").classList.add("hidden");
        let firstArt = data[0]
        document.querySelector('#galleryItem').src = firstArt.imageUrl 
        document.querySelector("#artWork").classList.remove("hidden")
        const art = document.querySelector("#artWork");
        console.log(art)
        let h3 = document.createElement('h1');
        h3.classList.add("artDescription")
        h3.textContent=data[0].title
        let author = document.createElement('h4');
        author.classList.add("artDescription")
        author.textContent=data[0].author
        art.appendChild(h3);
        art.appendChild(author);
        const p = document.createElement('p');
        p.classList.add("artDescription");
        p.textContent = data[0].description;
        art.appendChild(p);
        const a = document.createElement('a');
        a.classList.add("artDescription")
        a.href = data[0].wikipediaUrl;
        a.textContent=`Wikipedia article: `+ data[0].title;
        console.log(a)
        art.appendChild(a);
    })

    })

})