(()=> {
    let options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      /////////////////////////////////////////////////////////////////////////////////////


    let form = document.getElementById('form');
    let text = document.getElementById('test');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await getmissingImgsArtc();
        await getImgs(text.value);
    })


async function getmissingImgsArtc(){
    await fetch('/wp-json/AFI/v1/get_missing_articles', {...options})
    .then((res)=> {
        return res.json()
    })
    .then((data)=> {
        console.log(data)
    })
}
    async function getImgs(term){
        await fetch('/wp-json/AFI/v1/AFI_get_imgs?text='+term , {method: "GET",
        headers: {
          "Content-Type": "application/json",
        }})
        .then((res)=> {
            return res.json()
        })
        .then((data)=> {
            console.log(data)

        });
    }
})()