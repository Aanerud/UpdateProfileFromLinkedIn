# NodeGraphApp - Basic Auth Template for Microsoft Environments

NodeGraphApp is a Node.js web application template designed for Microsoft environments, leveraging Microsoft Entra ID (formerly Azure AD) for authentication. This application demonstrates a secure and modern way of using Microsoft Graph API to fetch user profiles and relevant people data. It is implemented using the Microsoft Authentication Library (MSAL) for JavaScript and Node.js, making it suitable for use in Single Page Applications (SPAs) within Microsoft's ecosystem.

Project Structure

Here is a breakdown of each file and its functionality:

- **`index.js`**: The main entry point for the Node.js server. This file sets up an Express server, dynamically injects environment variables into the HTML file, and serves the `index.html` file to the client.
  - **`injectEnvVariables(filePath, envVariables)`**: Helper function that reads the HTML file and replaces placeholders with environment variables from the `.env` file.

- **`public/index.html`**: The frontend of the application, containing the JavaScript code to handle user login and data fetching from Microsoft Graph API.
  - **`msalConfig`**: Configuration object for MSAL.js, dynamically populated with environment variables for client ID, authority, and redirect URI.
  - **`msalInstance`**: Instance of `PublicClientApplication` created using MSAL.js to manage authentication.
  - **`fetchProfile(token)`**: Fetches the user's profile data from Microsoft Graph API.
  - **`fetchPeopleIndex(token)`**: Fetches the relevant people index data from Microsoft Graph API.

- **`fetchProfile.js`**: Contains the backend logic for fetching the user's profile and people index data using Axios.
  - **`fetchProfile(accessToken)`**: Fetches the user's profile information from Microsoft Graph.
  - **`fetchPeopleIndex(accessToken)`**: Fetches the list of people relevant to the user, limited to the top 50 results and selecting only the `displayName` property.

- **`.env`**: Environment file that stores sensitive information such as the Tenant ID, Client ID, and Microsoft Entra ID endpoints. Make sure to create this file manually as it is not included in the repository for security reasons.

- **`package.json`**: Contains the project metadata, dependencies, and scripts needed to run the application.

Setup Your Own Demo

Follow these steps to set up and run your own demo of the NodeGraphApp:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Aanerud/NodeGraphApp_basicAuth.git
   cd NodeGraphApp_basicAuth
   ```

2. **Install Dependencies**:
   Make sure you have [Node.js](https://nodejs.org/en/) installed, then run:
   ```bash
   npm install
   ```

3. **Create a `.env` File**:
   In the root directory of the project, create a `.env` file with the following content:
   ```plaintext
   TENANT_ID=your-tenant-id
   CLIENT_ID=your-client-id
   AAD_ENDPOINT=https://login.microsoftonline.com/
   GRAPH_ENDPOINT=https://graph.microsoft.com/
   PORT=3000
   ```

   Replace `your-tenant-id` and `your-client-id` with the appropriate values from your Microsoft Entra ID (Azure AD) app registration.

4. **Create a Microsoft Entra ID Application**:
   - Go to the [Azure Portal](https://portal.azure.com/) and navigate to **Azure Active Directory** > **App registrations** > **New registration**.
   - Register your application and note down the **Application (client) ID** and **Directory (tenant) ID**.
   - Under **Authentication**, add a platform configuration for **Single-page application (SPA)** with the redirect URI `http://localhost:3000`.
   - Make sure **Access tokens** and **ID tokens** are checked under **Implicit grant and hybrid flows**.

5. **Run the Application**:
   Start the Node.js server by running:
   ```bash
   node index.js
   ```
   Open your browser and navigate to `http://localhost:3000`.

Security Considerations

#Note: No Client Secrets Required

This application does not require a client secret, as it uses the **Authorization Code Flow with Proof Key for Code Exchange (PKCE)** for authentication. This method is highly secure and does not involve storing sensitive information like client secrets on the client-side, which is particularly important for Single Page Applications (SPAs). The tokens are securely generated in the browser using the user's credentials, ensuring that they are always tied to the authenticated user and reducing the risk of security breaches.

#Why We Use User-Focused Tokens

By generating tokens connected to the user, the application ensures that data access is tightly controlled and personalized. The tokens are scoped to the user's permissions, enhancing security by enforcing access controls defined in Microsoft Entra ID. This method aligns with security best practices, reducing exposure to vulnerabilities and ensuring that tokens cannot be used maliciously by unauthorized clients.

Repository

You can find the source code for this project at the following GitHub repository:

[NodeGraphApp_basicAuth on GitHub](https://github.com/Aanerud/NodeGraphApp_basicAuth)

Feel free to fork, modify, and use this template for your own projects!
