const API_URL = "http://localhost:8081"

async function register() {

    const email =
        document.getElementById("email").value

    const password =
        document.getElementById("password").value

    const response = await fetch(
        `${API_URL}/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }
    )

    const data = await response.json()

    localStorage.setItem(
        "token",
        data.token
    )

    document.getElementById(
        "message"
    ).innerText = data.message
}

async function login() {

    const email =
        document.getElementById("email").value

    const password =
        document.getElementById("password").value

    const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }
    )

    const text = await response.text()

    if (!response.ok) {
        document.getElementById("message")
            .innerText = text

        return
    }

    const data = JSON.parse(text)

    localStorage.setItem(
        "token",
        data.token
    )

    document.getElementById("message")
        .innerText = data.message
}