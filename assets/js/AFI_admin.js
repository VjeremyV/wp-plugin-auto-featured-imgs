(()=> {
    let startButton = document.getElementById('generate_thumbnails');
    let options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      /////////////////////////////////////////////////////////////////////////////////////
    startButton.addEventListener('click', ()=> {
        fetch('/wp-json/AFI/v1/get_missing_articles', {...options})
        .then((res)=> {
            return res.json()
        })
        .then((data)=> {
            console.log(data)
        })
    })

})()