document.addEventListener("DOMContentLoaded", function() {
    sortBtn()
    getQuotes()
    document.querySelector('#new-quote-form').addEventListener('submit', handleSubmit)
});

function handleSubmit(e){
    e.preventDefault()
    let quoteObj = {
        quote:e.target.quote.value,
        author:e.target.author.value
    }
    createQuote(quoteObj)
    e.target.author.value = ''
    e.target.quote.value =''
    e.target.author.placeholder = 'Flatiron School'
    e.target.quote.placeholder = 'Learn. Love. Code.'
}

function renderQuotes(quotes){
    let likeObj = null
    let numLikes = 0
    if (quotes.likes != null){
        for (const [key, value] of Object.entries(quotes.likes)){
            likeObj = value
        }
    }
    if(likeObj != null){
        numLikes = 1
    }
    const li = document.createElement('li')
    const blockquote = document.createElement('blockquote')
    li.setAttribute('class', 'quote-card')
    blockquote.setAttribute('class','blockquote')

    const likeBtn = document.createElement('button')
    likeBtn.setAttribute('class','btn-success')
    likeBtn.innerHTML = `Likes: <span>${numLikes}</span>`

    const deleteBtn = document.createElement('button')
    deleteBtn.setAttribute('class','btn-danger')
    deleteBtn.innerHTML = 'Delete'

    const editBtn = document.createElement('button')
    editBtn.innerHTML = 'Edit'

    blockquote.innerHTML=`
      <p class="mb-0">${quotes.quote}</p>
      <footer class="blockquote-footer">${quotes.author}</footer>
      <br> 
    `
    blockquote.appendChild(likeBtn)
    blockquote.appendChild(deleteBtn)
    blockquote.appendChild(editBtn)

    li.appendChild(blockquote)
    console.log(likeObj)
    likeBtn.addEventListener('click',function(){
        if(likeObj == null)
        {
            likeObj =  {
                "quoteId": quotes.id,
                "createdAt": Date.now()
            }
            updateLikes(likeObj)
            numLikes = 1
            likeBtn.innerHTML = `Likes: <span>${numLikes}</span>`
        }
    })

    deleteBtn.addEventListener('click',function(){
        li.remove()
        deleteQuote(quotes.id)
    })
    let editClicked = 0
    editBtn.addEventListener('click', function(){
        const formEdit = document.createElement('form')
        const editQuote = document.createElement('input')
        const editAuthor = document.createElement('input')
        const submitBtn = document.createElement('botton')

        formEdit.setAttribute('id','edit-quote-form')

        submitBtn.setAttribute('type','submit')
        submitBtn.setAttribute('class', 'btn btn-primary')
        submitBtn.innerHTML = 'Submit'

        editQuote.setAttribute('class','form-control')
        editAuthor.setAttribute('class','form-control')
        editQuote.setAttribute('name','quote')
        editAuthor.setAttribute('name','author')

        editQuote.setAttribute('id',`editQuote${quotes.id}`)
        editAuthor.setAttribute('id',`editAuthor${quotes.id}`)

        editQuote.value =`${quotes.quote}`
        editAuthor.value =`${quotes.author}`

        submitBtn.addEventListener('click', function(){

            let quoteObj = {
                id: quotes.id,
                quote:editQuote.value,
                author:editAuthor.value
            }
            updateQuote(quoteObj)
            li.removeChild(li.lastChild)
            li.removeChild(li.firstChild)
            editClicked = 0
            blockquote.innerHTML=`
            <p class="mb-0">${quoteObj.quote}</p>
            <footer class="blockquote-footer">${quoteObj.author}</footer>
            <br> 
            `
            blockquote.appendChild(likeBtn)
            blockquote.appendChild(deleteBtn)
            blockquote.appendChild(editBtn)
            li.appendChild(blockquote)
        })

        if (editClicked == 0){
            formEdit.appendChild(editQuote)
            formEdit.appendChild(editAuthor)
            formEdit.appendChild(submitBtn)
            li.appendChild(formEdit)
            editClicked = 1
            
        } else
        {
            
            li.removeChild(li.lastChild)
            editClicked = 0
        }
        
    })


    document.body.appendChild(li)

}

function updateQuote(quoteObj){
    console.log(quoteObj)
    fetch(`http://localhost:3000/quotes/${quoteObj.id}`,{
        method: 'PATCH',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteObj)
    })
    .then (res => res.json())

}

function createQuote(quoteObj){
    fetch(`http://localhost:3000/quotes`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(quoteObj)
    })
    .then(res => res.json())
    .then(data => renderQuotes(data))
}

function updateLikes(likeObj){
    fetch(`http://localhost:3000/likes`,{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(likeObj)
    })
    .then (res => res.json())

}

function deleteQuote(id){
    fetch(`http://localhost:3000/quotes/${id}`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    
}

function getQuotes(){
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then (res => res.json())
    .then (data => data.forEach(quotes => renderQuotes(quotes)))
}

function clearQuotes(){
    let cardList = [ ...document.querySelectorAll('.quote-card')]
    cardList.forEach((card)=>{
        card.remove()
    })
}

function sortBtn(){
    const sortBtn = document.createElement('button')
    sortBtn.innerHTML = 'Sort'
    document.body.appendChild(sortBtn)
    let sortOn = 0
    sortBtn.addEventListener('click', function(){
        let cardList = [ ...document.querySelectorAll('.quote-card')]
        let nameListHolder = [ ...document.querySelectorAll('.blockquote-footer')]
        let nameList =[]
        nameListHolder.forEach((name)=>{
            nameList.push(name.innerHTML)
        })
        console.log(nameList.sort())
            if(sortOn == 0){
                nameList.forEach((card)=>{
                cardList.forEach((item)=>{
                    let itemName = item.querySelector('.blockquote-footer')
                    
                        if (card == itemName.innerHTML)
                        {
                            document.body.appendChild(item)
                        }
                    })
                })
                sortOn = 1
            }
            else{
                sortOn = 0
                clearQuotes()
                getQuotes()
            }
    })



}