(()=> {
    let acc = document.getElementsByClassName("accordion");
    let i;
    let accordionIcon = document.getElementById('accordionIcon');
    
    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");
    
        /* Toggle between hiding and showing the active panel */
        let panel = this.nextElementSibling;
        if (panel.style.display === "flex") {
            accordionIcon.classList.add("dashicons-arrow-down-alt2")
            console.log(accordionIcon)
            panel.style.display = "none";
        } else {
            panel.style.display = "flex";
            accordionIcon.classList.remove("dashicons-arrow-down-alt2")
        }
      });
    }

})()
