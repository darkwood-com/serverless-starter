Serverless Starter
==================

This project is a starter to deploy serverless application to the Internet.

It contains :
- A backend Api on top of [Symfony](https://symfony.com/) and [Api Platform](https://api-platform.com/)
- A static Frontend with [Gatsby](https://www.gatsbyjs.com) and [Bootstrap](https://getbootstrap.com)
    - Simple blog with tags and contributor
    - Documentation page generated from markdown files
    - Changelog contribution page with Github tags
    - Registration and Login pages with Logged Settings page.
    - Github and Facebook OAuth
    - 3 themes : light, dark, sepia
    - Contact section with Amazon Simple Email Service
- An [AWS](https://aws.amazon.com) deployment with [Serverless framework](https://www.serverless.com)
    - Two staging deployment `preprod` and `prod`
    - `preprod` staging Frontend is [preprod.serverless-starter.com](https://preprod.serverless-starter.com) and Api at [preprod-api.serverless-starter.com](https://preprod-api.serverless-starter.com)
    - `prod` staging Frontend is [serverless-starter.com](https://serverless-starter.com) and Api at [api.serverless-starter.com](https://api.serverless-starter.com)

You can use this starter for your own need.

Run it locally
--------------

- Run the Api
    - go to [./packages/api](./packages/api)
    - ```make docker-run``` to start MySQL service
    - ```make first-install``` to install dependencies and populate database
    - ```make run``` to start symfony local server
- Run the Frontend
    - go to [./packages/front](./packages/front)
    - ```make dev``` to start gatsby local server

Deploy it to AWS
----------------

- Deploy to `preprod`
    - go to [./packages/deploy](./packages/deploy)
    - configure `.env.api.preprod` and `.env.front.preprod` files
    - ```STAGE=preprod make deploy```
- Deploy to `prod`
    - go to [./packages/deploy](./packages/deploy)
    - configure `.env.api.prod` and `.env.front.prod` files
    - ```STAGE=prod make deploy```

Contribution
------------

All contributions are welcome to improve this starter
