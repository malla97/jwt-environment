# jwt-environment

This repository contains
1. the jwt validation API (jwt-validate). This is the same as [this repository](https://github.com/malla97/validate-jwt), but with the addition of trusting the localhost https server.
2. self-sigend https server that can be used for local testing (cert-server)
3. function generating a JWT (generate-jwt)

All of these were originally created separately but were collected to this repository, therefore they all have their own folders and package.json -files, etc. For convinience the reading of pem-files have been changed to read from the root of the repository.
Secondly the jwt-validation program has an addition in the certUtils.js file which allows the https certificate fetch-function to trust the self-signed https localhost server using the generated cert.pem file. This allows the testing of the JWT signature validation using a selfmade server that returns a PEM-encoded X.509 certificate.

### How to use
After cloning this repository, the first step should be to create private key. The public key, and the self-signed certificate can be then created using the generated private.key. All of these should be created to the *root* of the project.
All of these can be done using OpenSSL.
1. Private key: *openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048*
2. Public key: *openssl rsa -in private.pem -pubout -out public.pem*
3. Self signed PEM-encoded X.509 certificate:
   - first create a CSR with: *openssl req -new -key private.pem -out csr.pem*, when creating set the company name to localhost, otherwise jwt validation API wont retrieve the certificate from the server
   - Then, using the CSR the certificate can be made with: *openssl x509 -req -in csr.pem -signkey private.pem -out cert.pem*
  
Second order of business is creating the JWT. From the root of the project move to the generate-jwt folder (cd generate-jwt). After this
1. run npm install
2. run node index.js

Now in the terminal there should be a generated JWT. Save that somewhere for later use or leave it in the terminal so that you can copy it. If you want to change the values in the payload, open the index.js file in an IDE and change the values in payload to the ones you want. DONT change the keys (sub, name, ...) only their values.

const payload = {

    sub: '0987654321',
    
    name: 'John Doe',
    
    iat: Math.floor(Date.now() / 1000), // issued at current time
    
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365), // expiration time 1 year from now
    
};

Then for running the validation API and the server, in the terminal navigate to validate-jwt and cert-server in their own terminal windows. After this run npm install for both. Lastly both can be started with node index.js commands. The JWT validation API runs on *http://localhost:8080* and the cert-server runs on *https://localhost:3000*.

Now that both are running you can open Postman (or similar application that you prefer using) to test this. In Postman do a GET-request to *http://localhost:8080/auth* with Authorization header that has the generated JWT value. Add Bearer to be infront of the JWT. For example:
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIng1dSI6Imh0dHBzOi8vbG9jYWxob3N0OjMwMDAvY2VydC5wZW0ifQ.eyJzdWIiOiIwOTg3NjU0MzIxIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNzEzNjQ1NDU0LCJleHAiOjE3NDUxODE0NTR9.Xny-5TGeFcODhR7Q63iM3pTVLYZRR-3H0y71lLg7aqH0ZXOuTmQJuTR6wJzQDsqrkgySrF-8pgCy6zinuxI-InYoMm4X0Be-njtHaEraokuTzY0H2_EyTZ_4Sq6t6lX2q7-oorraPAlJzppoBGeeKN6BylWrAYHVIRlse-f7iRFqQLz7nMDS__RaPk1JYXIOUtJbdJqrGkfJ2alMfG-VNCvKwdRv1LAq78sOl79Mm46FchVLfFkS9nQFIB0k7MIrPIWL3zVXnQ8VmSmgyyVyWTx63QmmUg-4OBOejdXlXMmfXxYIDDi07jaM1RwtFQBg54u3WgdgT1cLtDFZkVPR7A

After sending, the response should tell if the token was valid or not. If it's not valid the response says what was wrong. Response if JWT is valid:
{
    "valid": true
}
Response if JWT is not valid:
{
    "valid": false,
    "message": "JWT has expired"
}

