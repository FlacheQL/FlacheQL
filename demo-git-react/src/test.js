const query = `{
    author(id: 4339){
      name
      books {
        title
        isbn
      }
    }
  }`

fetch('http://localhost:4001/graphql', {
    method: 'POST',
    headers: { "Content-Type": "application/graphql" },
    body: `{
        author(id: 4339){
          name
          books {
            title
            isbn
          }
        }
      }`,
})
.then((res) => res.json())
.then((res) => {
    console.log(res)
})