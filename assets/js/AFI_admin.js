(()=> {
    console.log('prout')
    let options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      let formGenerateImgs = document.getElementById('generateImgs');
      let envatoAPIForm = document.getElementById('envatoAPIForm');
      let text = document.getElementById('text');

      /////////////////////////////////////////////////////////////////////////////////////

      envatoAPIForm.addEventListener('submit', (e)=> {
        e.preventDefault();
      })

    formGenerateImgs.addEventListener('submit', async (e) => {
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