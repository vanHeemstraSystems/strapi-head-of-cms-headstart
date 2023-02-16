# 200 - Docker for Development Environment

Based on "Create a food ordering app with Strapi and Next.js 1/7" at https://strapi.io/blog/nextjs-react-hooks-strapi-food-app-1

First things first, let's set up our environment variables to avoid hard coding our API URL and having to update on every deployment.

Add below content to ```sample.env``` for development.

```
...
NEXT_PUBLIC_API_URL_DEV='http://localhost:1337'
...
```
containers/app/sample.env

Next.js is built to handle any routing for us and uses the files in the ```/pages``` directory as the routes for the application. To set up a route simply creates the ```/pages``` directory and add an ```index.js``` file with:

```
$ cd containers/app/cms
$ mkdir pages
$ cd pages
$ touch index.js
```

Now that we have our main route (index.js), this will map to the root ('/') (i.e. www.yourapp.com) of your application. To test this you can insert the following into the ```index.js``` file:

```
...
export default () => <div>Welcome to next.js!</div>
...
```
containers/app/cms/pages/index.js

## 100 - Starting CMS GUI in Development Environment

To start your local development server, in a 2nd terminal window navigate to the ```cms``` folder and run ```yarn dev```:

```
$ cd containers/app/cms
$ yarn dev
```

Your application should now be visible at ```http://localhost:3000```.

```
Welcome to next.js!
```
https://localhost:3000

### Adding Bootstrap

For this tutorial, we will use react-strap to implement Bootstrap 4 into our application. We will import our styles and CSS directly into the header by importing from the hosted CDN.

First, install Reactstrap:

```
$ cd containers/app/cms
$ yarn add reactstrap
```

***reactstrap*** is a front-end library to easily create Bootstrap components and styling. This will take care of the heavy lifting on the front end.

To import the CSS and share a Layout component across all our pages we will use a custom ```_app.js``` file inside the ```pages``` directory.

This file will serve to override the default App.js used by Next and be rendered on each page, allowing us to set and manage global styles and shared components in one place of the application.

You can read more about the ```_app.js``` handling here: https://nextjs.org/docs/advanced-features/custom-app

This will allow us the ability to import a ```<Head>``` component and globally set the stylesheet inside the header.

```
$ cd containers/app/cms/pages
$ touch _app.js
```

Add the following content to ```_app.js```:

```
import React from "react";
import App from "next/app";
import Head from "next/head";

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
            integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
            crossOrigin="anonymous"
          />
        </Head>

        <Component {...pageProps} />
      </>
    );
  }
}
```
containers/app/cms/pages/_app.js

Now if we add in reactstrap components inside of ```index.js``` we should see the bootstrap styling applied once the page refreshes automatically.

Update ```index.js``` with the following:

```
import { Button, Alert } from "reactstrap";

export default () => {  
  return (
    <div>
      <div>
        <Alert color="primary">
          Hello Project is strapi-next with Bootstrap
        </Alert>
        &nbsp; <Button color="primary">Hello from nextjs</Button>
      </div>
    </div>
  );
};
```
containers/app/cms/pages/index.js

Restart your server to apply the new changes if you do not see the components.

### Designing the page

Now that we have Bootstrap running inside of our Next project, we can begin to style the shared frontend components like the navbar.

First, create a folder to store our ```components``` and create our ```Layout``` component:

```
$ cd containers/app/cms
$ mkdir components
$ cd components
$ touch Layout.js
```

Next uses the ```<Link>``` component to perform the client-side routing between pages. The Link component is the next component and can accept any HTML element that has an onClick handler as a child component (```<a>```,```<button>```,```<div>``` etc.).

To style our navbar we can use the built-in CSS in JS syntax ```<style jsx>``` shipped by default with next.

Inserting CSS in JS as in next is as easy as:

```
<style jsx> {`
  a { color: yellow }
`}
</style>
```

This allows us to scope CSS to the components the style tag is located in. You can also pass in the global option to set a global style across the project: ```<style jsx global>``` this would set styling across pages and components for all elements that match the CSS selector.

You can read more on CSS in JS in the Next documents [here](https://nextjs.org/docs/#css-in-js).

Open the ```Layout.js``` file and create the shared layout components and insert the Stripe script (for later) as follows:

```
import React from "react";
import Head from "next/head";
import Link from "next/link";

import { Container, Nav, NavItem } from "reactstrap";

export default function Layout(props) {
  const title = "Welcome to Nextjs";
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
          crossOrigin="anonymous"
        />
        <script src="https://js.stripe.com/v3" />
      </Head>
      <header>
        <style jsx>
          {`
            a {
              color: white;
            }
          `}
        </style>
        <Nav className="navbar navbar-dark bg-dark">
          <NavItem>
            <Link href="/">
              <a className="navbar-brand">Home</a>
            </Link>
          </NavItem>

          <NavItem className="ml-auto">
            <Link href="/login">
              <a className="nav-link">Sign In</a>
            </Link>
          </NavItem>

          <NavItem>
            <Link href="/register">
              <a className="nav-link"> Sign Up</a>
            </Link>
          </NavItem>
        </Nav>
      </header>
      <Container>{props.children}</Container>
    </div>
  );
}
```
containers/app/cms/components/Layout.js

Edit the ```_app.js``` file to use the new ```Layout``` component across the application:

```
import React from "react";
import App from "next/app";
import Head from "next/head";
import Layout from "../components/Layout";
export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
            integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
            crossOrigin="anonymous"
          />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </>
    );
  }
}
```
containers/app/cms/pages/_app.js

We will create two additional pages to allow users to sign in and sign up at ```/login``` and ```/register``` respectively.

You will need to create the corresponding files inside the ```/pages``` directory for next to recognize the routes.

```
$ cd containers/app/cms/pages
$ touch login.js register.js
```

Populate the files with the following code that we will come back to once our CMS Backend (using: Strapi) server is set up (see https://github.com/vanHeemstraSystems/content-management-systems/browse).

```
export default () => {
  return <h1>Sign Up</h1>;
};
```
containers/app/cms/pages/login.js

```
export default () => {
  return <h1>Sign In</h1>;
};
```
containers/app/cms/pages/register.js

You should now see the routes at http://localhost:3000/login and http://localhost:3000/register

## 200 - Create Components for Development for CMS

Based on "Create an food ordering app with Strapi and Next.js 2/7" at https://strapi.io/blog/nextjs-react-hooks-strapi-restaurants-2

We are going to do some of the below work through the 'Admin' panel of the separately created Content Management Services backend (see https://github.com/vanHeemstraSystems/content-management-systems/browse).

### Groups list

First of all, we need to display the list of groups in our web app. Of course, this list is going to be managed through our API. So, we are going to start configuring it.

**Define Content Type**

A Content Type, also called a ```model```, is a type of data. The Strapi API includes by default, the ```user``` Content Type. Right now we need ```groups```, so our new Content Type is going to be, as you already guessed, ```group``` (Content Types are always singular).

Here are the required steps:

- Navigate to the Content Type Builder in the sidebar (https://HOST-AND-PORT-OF-CMS-BACKEND-SERVER/admin/plugins/content-type-builder).

For the value of ```HOST-AND-PORT-OF-CMS-BACKEND-SERVER``` consult the implementation of your ***CMS Backend*** as created from https://github.com/vanHeemstraSystems/content-management-systems/browse

For now we **assume** the development server of the ***CMS Backend*** to be the following (make sure it is up and running as well as reachable):

```
Server: 172.30.123.53
Port: 1436 (for development)
```
Verify where your CMS Backend can be reached!

![Strapi Login Page Screen Shot](strapi_login_page_screen_shot.png)

Strapi Login Page

![Strapi Welcome Page Screen Shot](strapi_welcome_page_screen_shot.png)

Strapi Welcome Page

![Strapi Admin Plugins Content Types Library Screen Shot](strapi_admin_plugins_content_types_builder_screen_shot.png)

Strapi Admin Plugins Content-Types Library Page

Click on ```+ Create a new collection type```. 

Set ```group``` as Display name. **Note** use singular, not plural form of the name.

![Strapi Create Content Type Group Screen Shot](strapi_create_content_type_group_page_screen_shot.png)

Strapi Create Content-Type Group Page

Click on ```Continue``` and create the following fields:

- **name** with type Text, Short text.

- **description** with type Rich Text.

- **image** with type Media, Single media.

![Strapi Content Type Group Screen Shot](strapi_content_type_group_page_screen_shot.png)

Strapi Content-Type Group Page

Click on ```Finish```.

Click on ```Save``, the server should restart automatically.

At this point, your server should have automatically restarted and a new link ```Groups``` appears in the left menu.

![Strapi Group Screen Shot](strapi_group_page_screen_shot.png)

Strapi Group Page

**Add Some Entries**

Well done! You created your first Content Type. The next step is to add some groups in your database. To do so, click on "Groups" in the left menu (http://172.30.123.53:1436/admin/plugins/content-manager/group?source=content-manager).

You are now in the Content Manager plugin: an auto-generated user interface that let you see and edit entries.

Let's create a group:

- Click on ```Add New Groups```.
- Give it a name (here: ```Code```), a description (here: ```Code group```), and an image (here: image of a software coder, see google.com).
- Save it.
- Publish it.

Create the following groups likewise as you would like to see in your apps.

- Group: name = ```Provision```, description = ```Provision group```, image = image of a computer

- Group: name = ```Build```, description = ```Build group```, image = image of building software

- Group: name = ```Test```, description = ```Test group```, image = image of testing software

**Allow Access**

Having the items in database is great. Being able to request them from an API is even better. As you already know, Strapi's mission is to create API (I have got a super secret anecdote for you: its name is coming from Bootstrap your API 😮).

When you were creating your ```group``` Content Type, Strapi created on the backend, a few set of files located in ```api/group```.

These files include the logic to expose a fully customizable CRUD API. The ```find``` route is available at http://172.30.123.53:1436/groups. Try to visit this URL and you will be surprised to be blocked by a 403 forbidden error. This is actually totally normal: Strapi APIs are secured by design.

Don't worry, making this route accessible is actually super intuitive:

- Navigate to the ```Settings``` then ```Users & Permissions Plugin / Roles```.
- Click on the ```Public``` role.
- Tick the ```count```, ```find``` and ```findone``` checkboxes of the ```Group``` section.
- Save.

![Strapi Group Roles & Permissions Screen Shot](strapi_group_roles_permissions_page_screen_shot.png)

Strapi Group Roles & Permissions Page

***Important***: do the same thing for the authenticated role.

Now go back to http://172.30.123.53:1436/groups: at this point, you should be able to see your list of groups.

![Strapi Group API Screen Shot](strapi_group_api_screen_shot.png)

Strapi Group API

***Note***: We are using [Chrome JSON Viewer](https://chrome.google.com/webstore/detail/json-viewer/gbmdgpbipfallnflgajpaliibnhdgobh?hl=nl) to get the nicely formatted output in the browser.

**Enabling GraphQL**

By default, API's generated with Strapi are REST endpoints. We can easily integrate the endpoints into GraphQL endpoints using the integrated GraphQL plugin.

Let's do that (see also https://docs.strapi.io/developer-docs/latest/plugins/graphql.html).

To get started with GraphQL in your app, please install the plugin first. To do that, open your terminal and run the following command on the **cms headless server**:

```
$ cd containers/app/cms
$ yarn strapi install graphql
```
Run above command on the cms headless server

That's it, you are done installing GraphQL. Simple Enough.

Make sure to restart your strapi server if it does not auto restart

Restart your server, go to http://172.30.123.53:1436/graphql. You should see the interface (```GraphQL Playground```) that will help you to write GraphQL query to explore your data. Try this query:

```{ groups { id name } }```

![Strapi Groups GraphQL Screen Shot](strapi_groups_graphql_screen_shot.png)

Strapi Groups GraphQL

**Display Groups**

It looks you are going in the right direction. What if we would display these groups in our Next app?

Install Apollo in our application, navigate to the /cms folder in a terminal window:

```
$ cd containers/app/cms
$ yarn add next-apollo@3.1.10 graphql@15.0.0 apollo-boost@0.4.7 @apollo/react-hooks@3.1.5 @apollo/react-ssr@3.1.5
```

Again I am going to lock to the current versions at the time of writing for compatibility. You can choose to use the latest if you follow any upgrade documentation for your package.

***Warning***: next-apollo v4 breaks this implementation careful if using the latest

To connect our application with GraphQL we will use Apollo and the next-apollo implementation to wrap our components in a ```withData``` function to give them access to make GraphQL data queries.

There are a couple of different approaches to implementing GraphQL into a Nextjs app. We are going to extract the Apollo logic into a ```lib``` folder and wrap our ```_app.js``` component with a function called ```withData``` to give access to Apollo client config inside all child components. This is what gives Apollo access to make GraphQL queries directly in our components as you will see!

This structure allows us to extract certain shared logic of our application into distinct locations for easy upgrades/modifications in the future.

Feel free to implement a different method as you seem fit, this is not dependent on Strapi. Any GraphQL implementation will work with Strapi

Example repo detailing the Apollo Next.js implementation.

Create a ```lib``` directory in the root of the project:

```
$ cd containers/app/cms
$ mkdir lib
$ touch apollo.js
```

Add the following content to ```apollo.js```:

```
import { HttpLink } from "apollo-link-http";
import { withData } from "next-apollo";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337"

const config = {
  link: new HttpLink({
    uri: `${API_URL}/graphql`, // Server URL (must be absolute)
  })
};
export default withData(config);
```
containers/app/cms/lib/apollo.js

We will generate the list of ```Groups``` inside a ```GroupList``` file as:

```
$ cd containers/app/cms
$ cd components
$ mkdir GroupList
$ cd GroupList
$ touch index.js
```

Add the following content to ```index.js```:

```
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Link from "next/link";

import {
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

const QUERY = gql`
  {
    groups {
      id
      name
      description
      image {
        url
      }
    }
  }
`;

function GroupList(props) {
  const { loading, error, data } = useQuery(QUERY);
  if (error) return "Error loading groups";
  //if groups are returned from the GraphQL query, run the filter query
  //and set equal to variable groupSearch
  if (loading) return <h1>Fetching</h1>;
  if (data.groups && data.groups.length) {
    //searchQuery
    const searchQuery = data.groups.filter((query) =>
      query.name.toLowerCase().includes(props.search)
    );
    if (searchQuery.length != 0) {
      return (
        <Row>
          {searchQuery.map((res) => (
            <Col xs="6" sm="4" key={res.id}>
              <Card style={{ margin: "0 0.5rem 20px 0.5rem" }}>
                <CardImg
                  top={true}
                  style={{ height: 250 }}
                  src={`${process.env.NEXT_PUBLIC_API_URL}${res.image.url}`}
                />
                <CardBody>
                  <CardTitle>{res.name}</CardTitle>
                  <CardText>{res.description}</CardText>
                </CardBody>
                <div className="card-footer">
                  <Link
                    as={`/groups/${res.id}`}
                    href={`/groups?id=${res.id}`}
                  >
                    <a className="btn btn-primary">View</a>
                  </Link>
                </div>
              </Card>
            </Col>
          ))}

          <style jsx global>
            {`
              a {
                color: white;
              }
              a:link {
                text-decoration: none;
                color: white;
              }
              a:hover {
                color: white;
              }
              .card-columns {
                column-count: 3;
              }
            `}
          </style>
        </Row>
      );
    } else {
      return <h1>No Groups Found</h1>;
    }
  }
  return <h5>Add Goups</h5>;
}

export default GroupList;
```
containers/app/cms/components/GroupList/index.js

***WARNING***: ```reactstrap``` version 9 has a breaking change, where ```InputGroupAddon``` has been removed. Hence, we need to fix to the latest version of reactstrap version 8. Rectify the ```package.json``` so it shows ```  "reactstrap": "8.10.1"``` instead of ```"reactstrap": "^9.0.1"```.

Now update your ```/pages/index.js``` home route to display the Group list and a search bar to filter the groups:

```
import React, { useState } from "react";
import { Col, Input, InputGroup, InputGroupAddon, Row } from "reactstrap";
import GroupList from "../components/GroupList";

function Home() {
  const [query, updateQuery] = useState("");
  return (
    <div className="container-fluid">
      <Row>
        <Col>
          <div className="search">
            <InputGroup>
              <InputGroupAddon addonType="append"> Search </InputGroupAddon>
              <Input
                onChange={e => updateQuery(e.target.value.toLocaleLowerCase())}
                value={query}
              />
            </InputGroup>
          </div>
          <GroupList search={query} />
        </Col>
      </Row>
      <style jsx>
        {`
          .search {
            margin: 20px;
            width: 500px;
          }
        `}
      </style>
    </div>
  );
}

export default Home;
```
containers/app/cms/pages/index.js

(Re-)start your server.

```
$ cd containers/app/cms
$ yarn dev
```

Browse to http://localhost:3000

![Strapi GUI Groups Missing Images Screen Shot](strapi_gui_groups_page_missing_images_screen_shot.png)

Strapi GUI Groups - Missing Images

Now you should see the list of groups on the page that are filterable!

![Strapi GUI Groups Error Screen Shot](strapi_gui_groups_page_error_screen_shot.png)

Strapi GUI Groups - Error

If you see above error, ***405 'Method Not Allowed'***, do the following on the cms headless server:

- Add or updated the middleware on the cms headless server (as documented at https://docs-v3.strapi.io/developer-docs/latest/setup-deployment-guides/configurations.html#middlewares), where you add **Cross Origin Resource Sharing (CORS)** as follows:

```
module.exports = {
  load: {
    before: ['timer', 'responseTime', 'logger', 'cors', 'responses', 'gzip'],
    after: ['parser', 'router'],
  },    
  settings: {
    cors: {
      enabled: true,  
      origin: ['*'], //allow all origins
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"], //allow these methods 
      headers: ['*'] //allow all headers
    },
  },
};
```
[On cms headless server] containers/app/cms/config/middleware.js

Restart the cms headless server and try again to open the page at http://localhost:3000











=== WE ARE HERE ===
