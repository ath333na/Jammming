export async function returnProfile() {
    const clientId = `006e5671959446b89529c7ad4e1e095c`;
    const code = getCodeFromUrl(); // Extract code from URL

    if (!code) {
        redirectToAuthCodeFlow(clientId);
    }
    
    const accesstoken = await generateAccessToken(clientId, code)
    console.log("Accesstoken:", accesstoken)

}

function getCodeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('code');
}

export async function redirectToAuthCodeFlow(clientId) {
    try {
        const verifier = generateCodeVerifier(128);
        const challenge = await generateCodeChallenge(verifier);

        localStorage.setItem("verifier", verifier);

        document.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=http://localhost:5173/&scope=user-read-private%20user-read-email&code_challenge_method=S256&code_challenge=${challenge}`;
    } catch (error) {
        console.log(error);
    }
}

export function generateCodeVerifier(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export async function generateCodeChallenge(codeVerifier) {
    try {
        const data = new TextEncoder().encode(codeVerifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    } catch (error) {
        console.log("Couldn't verify code / Codechallenge");
    }
}

export async function generateAccessToken(clientId, code) {
    try{
        const verifier = localStorage.getItem('verifier');
        const clientSecret = `b82e03c231744933bf1ee3085c47831b`
    
    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
         },
        body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
    });


    const response = await result.json();
    localStorage.setItem('accesstoken', response.access_token);
    return response.access_token
    }
    catch (error) {
        console.log("Failed accesstoken request", error)
    }
}

export async function fetchProfile(token) {
    const result = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}

export default returnProfile