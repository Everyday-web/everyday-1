// let main_Url = 'http://localhost:3000/'

function FPost(url='', data={}) {
    const response = await fetch(url,{
        method: 'POST',
        code: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response.json();
}

function FGet(url='', data={}) {
    const response = await fetch(url,{
        method: 'POST',
        code: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response.json();
}


// async function postData(endpoint, options={}) {
//     const res = await 
// }