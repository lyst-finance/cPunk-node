const addAttribute = () => {

    historicalPunkData.forEach(event => {
        punkAttributes.forEach(punk => {
            if(event.punkIndex === punk.id){
                event.type = punk.type;
                event.count = punk.count
            }
        })
    })
}

addAttribute();

