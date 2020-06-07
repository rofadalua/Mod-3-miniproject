
document.addEventListener("DOMContentLoaded",()=>{
    fetch('http://localhost:3000/posts')
    .then(res=>res.json())
    .then(posts=>{
        createPostForm()
        posts.forEach(post => {
      
            appendPost(post)
        })
    })

    const createPostForm = () => {
        let newPostForm = document.createElement("form")
        newPostForm.id = "message_form"
        let postTitle = document.createElement("input")
        let postContent = document.createElement("input")
        let postImg = document.createElement("input")
        let postSubmit = document.createElement("input")
    
        postTitle.setAttribute("type", "text")
        postTitle.setAttribute("placeholder", "Post Title")
        postContent.setAttribute("type", "text")
        postContent.setAttribute("placeholder", "Post Content")
        postImg.setAttribute("type", "text")
        postImg.setAttribute("placeholder", "Image URL")
        postSubmit.setAttribute("type", "submit")
        postSubmit.innerText = "Create Post"
        
    
        newPostForm.append(postTitle,postContent,postImg,postSubmit)
    
        newPostForm.addEventListener('submit', (e)=>{
            e.preventDefault()
            createPost(postTitle.value, postContent.value, postImg.value)
            e.target.reset()
        })
        let main = document.querySelector("main")
        main.prepend(newPostForm)    
    }
    

const appendPost = (post) => { 
    const postDiv = document.createElement('div')

    const img = document.createElement('img')
    img.src = post.img_url  
    img.style.width = "450px"

    const h3 = document.createElement('h3')
    h3.innerText = post.title

    const p = document.createElement('p')
    p.innerText = post.content
    
    const h5 = document.createElement('h5')
    h5.innerText = post.likes

    const ul = document.createElement('ul')
   
    post.comments.forEach((comment)=>{
        appendComment(comment,ul)
    })

    const commentBtn = document.createElement('button')
    commentBtn.className = 'btn-comments'
    commentBtn.innerText = 'New Comment Form'
    
    let isCommenting = false
    commentBtn.addEventListener('click', () => {
            if (isCommenting === false){
                isCommenting = true
                const form = document.createElement('form')
                form.className = "comment-form"
                const content = document.createElement('input')
                const submit = document.createElement('input')
                content.setAttribute('type','text')
                content.setAttribute('placeholder', "New comment...")
                submit.setAttribute('type', 'submit')
                submit.setAttribute('value', 'Submit Comment')
                form.append(content,submit)
                postDiv.insertBefore(form,commentBtn)
             
            form.addEventListener('submit',(e) =>{
                e.preventDefault()
            
            fetch('http://localhost:3000/comments',{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
             //this whole body object is the same object that is called "params" in your backend
            body: JSON.stringify({
                content: content.value,
                post_id: post.id
            })
        }).then(res=>{
            return res.json()
        }).then(newComment=>{
            appendComment(newComment, ul) //use function back from top 
            form.remove()
            isCommenting = false
        })
        })
            } else {
                const form = postDiv.querySelector(".comment-form")
                form.remove()
                isCommenting = false
            }


})

    const pause = document.createElement('div')
    pause.innerText = "----------"

    const likeBtn = document.createElement('button')
    likeBtn.className = 'btn-success'
    likeBtn.innerText = `Likes`
    likeBtn.addEventListener('click', () =>{

        fetch(`http://localhost:3000/posts/${post.id}`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
             //this whole body object is the same object that is called "params" in your backend
            body: JSON.stringify({
                likes: ++post.likes
            })
        })
        .then(res => res.json())
        .then(updatedPost => {
            h5.innerText = updatedPost.likes
        })
    })
   
    const editBtn = document.createElement('button')
    editBtn.className = 'btn-edit'
    editBtn.innerText = 'Edit'
    let isEditing = false

    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'btn-delete'
    deleteBtn.innerText = 'Delete'

    editBtn.addEventListener('click', ()=>{
        if (isEditing === false){
            isEditing = true
            const form = document.createElement('form')
            form.className = "edit-form"
            const title = document.createElement('input')
            const content = document.createElement('input')
            const submit = document.createElement('input')
            title.setAttribute('type', 'text')
            title.setAttribute('value', post.title)
            content.setAttribute('type', 'text')
            content.setAttribute('value', post.content)
            submit.setAttribute('type', 'submit')
            submit.setAttribute('value', 'Edit Post')
            form.append(title,content,submit)
            postDiv.insertBefore(form,likeBtn)

            form.addEventListener('submit', (e)=>{
                e.preventDefault()
                fetch(`http://localhost:3000/posts/${post.id}`,{
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json"
                    },
                     //this whole body object is the same object that is called "params" in your backend
                    body: JSON.stringify({
                        title: title.value,
                        content: content.value
                    })
                }).then(res=>res.json())
                .then(updatedPost => {
                    Object.assign(post,updatedPost)
                    h3.innerText = updatedPost.title
                    p.innerText = updatedPost.content
                    form.remove()
                    isEditing = false
                })
            })
        }
      else {
            const form = postDiv.querySelector(".edit-form")
            form.remove()
            isEditing = false
      }
    })

    deleteBtn.addEventListener("click",() => {
        fetch(`http://localhost:3000/posts/${post.id}`,{
            method:"DELETE"
        }).then(postDiv.remove())
    })
    let container = document.getElementById("post-container")
    postDiv.append(img,h3,p,ul,h5,commentBtn,pause,likeBtn,editBtn,deleteBtn)
    container.append(postDiv)


}

const appendComment = (comment, container) => {
    const li = document.createElement('li')
    li.innerText = comment.content
    const x = document.createElement('button')
    x.innerText = 'x'

    x.addEventListener('click', ()=>{
        fetch(`http://localhost:3000/comments/${comment.id}`,{
            method: "DELETE"
        }).then(li.remove())
    })
    li.append(x)
    container.append(li)

}

// const form = document.getElementById("message_form")
// const div = document.createElement('content')
// form.addEventListener("submit", (e)=>{
//     e.preventDefault()
//     // console.log(e.target[0].value, e.target[1].value)
//     createPost(e.target[0].value, e.target[1].value)
// })

const createPost = function(title,content,img_url,){
    fetch('http://localhost:3000/posts',{
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
         //this whole body object is the same object that is called "params" in your backend
        body: JSON.stringify({
            title,
            content,
            img_url
        })
    }).then(res=>{
        return res.json()
    }).then(post=>{
        appendPost(post) //use function back from top 
    })
   
}

})
