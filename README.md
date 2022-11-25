# General Backend

> This a general purpose edge API that is used by my front-end projects.
> Live Demo: [https://general-backend.cyclic.app/](https://general-backend.cyclic.app/)

## Getting Started

1. Clone and cd into the repo. `git clone https://github.com/willwalker753/general-backend.git && cd general-backend`
2. Create an .env file based on the template. Make sure to add your api keys to it. `cp template.env .env`
3. Start the app.
   * If Docker is installed on your system, run start.sh `. start.sh`
   * Otherwise, start the app with node. `npm install && npm run dev`
4. The app is now listening on port `8000` :)

## Testing 
   * Run the health check endpoint `curl http://localhost:8000/`
   * There is a Postman collection and environment in the `/postman` directory
     * Change the Postman `endpoint` environment variable  to `localhost:8000`. It is set to `personal:8000` by default.
