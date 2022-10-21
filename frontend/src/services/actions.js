
const BASE_URL = "http://localhost:3001"

const get_actions = async (user) => {
    const res = await fetch(`${BASE_URL}/actions`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        }
    })

    return await res.json()
}

const create_action = async (user, action) => {
    const res = await fetch(`${BASE_URL}/actions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(action)
    });

    return await res.json()
}

export {
    get_actions,
    create_action
}
